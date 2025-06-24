import { DataSchema } from ".";

type Data<Schema> = {
	sessionId?: string;
	data: Schema;
};

export default class SchemaStoreSession<Schema extends DataSchema> {
	private data!: Data<Schema>;
	readonly jobId: string;
	readonly template: Schema;
	readonly profileKey: string;
	readonly apiStore: DataStore;

	getData(): Schema {
		return this.data.data;
	}

	constructor(apiStore: DataStore, profileKey: string, template: Schema) {
		this.jobId = game.JobId;
		this.template = template;
		this.profileKey = profileKey;
		this.apiStore = apiStore;

		this.reconcile();

		pcall(() => {
			apiStore.UpdateAsync(profileKey, (data: Data<Schema> | undefined) => {
				if (data === undefined) {
					const newData: Data<Schema> = {
						sessionId: this.jobId,
						data: template,
					};
					this.data = newData;
					return $tuple(newData);
				}
				if (data.sessionId !== undefined || data.sessionId === this.jobId) {
					data.sessionId = this.jobId;
					this.data = data;
				}
				return $tuple(data);
			});
		});
		print(this.data);
	}

	reconcile(): void {
		// add proper reconiliation later
		if (this.data === undefined) {
			const newData: Data<Schema> = {
				data: this.template,
			};
			this.data = newData;
		}
	}

	endSession(): void {
		this.Save();
		pcall(() => {
			this.apiStore.UpdateAsync(this.profileKey, (data: Data<Schema> | undefined) => {
				if (data === undefined) {
					const newData: Data<Schema> = {
						data: this.template,
					};
					this.data = newData;
					return $tuple(newData);
				}
				if (data.sessionId === this.jobId) {
					data.sessionId = undefined;
					this.data = data;
				}
				return $tuple(data);
			});
		});
	}

	Save(): void {
		pcall(() => {
			this.apiStore.SetAsync(this.profileKey, this.data);
		});
	}
}
