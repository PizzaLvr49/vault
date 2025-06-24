import { DataStoreService } from "@rbxts/services";
import SchemaStoreSession from "./SchemaStoreSession";

type DataSchema = { [key: string]: DataSchema } | number | string | boolean | DataSchema[];

export class SchemaStore<Schema extends DataSchema> {
	private readonly template: Schema;
	private readonly ApiStore: DataStore;

	constructor(storeName: string, template: Schema) {
		this.template = template;
		this.ApiStore = DataStoreService.GetDataStore("___SS", storeName);
	}

	ReadAsync(player: Player): Schema {
		const data = this.ApiStore.GetAsync(`Player_${player.UserId}`);
		print(data);

		return (data as unknown as Schema) ?? this.template; // fix later lol
	}

	StartSessionAsync(key: string): SchemaStoreSession {
		return new SchemaStoreSession();
	}
}

new SchemaStore<{ hello: string }>("", { hello: "" });
