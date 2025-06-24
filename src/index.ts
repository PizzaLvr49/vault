import { DataStoreService } from "@rbxts/services";
import SchemaStoreSession from "./SchemaStoreSession";

export type DataSchema = { [key: string]: DataSchema } | number | string | boolean | DataSchema[];

export class SchemaStore<Schema extends DataSchema> {
	private readonly template: Schema;
	private readonly ApiStore: DataStore;

	constructor(storeName: string, template: Schema) {
		this.template = template;
		this.ApiStore = DataStoreService.GetDataStore("___SS", storeName);
	}

	// ReadAsync(player: Player): Schema {
	// 	const key = `Player_${player.UserId}`;

	// 	this.ApiStore.SetAsync(key, this.template);

	// 	const data = this.ApiStore.GetAsync(key);
	// 	print(data);

	// 	const versions = this.ApiStore.ListVersionsAsync(key, Enum.SortDirection.Descending);
	// 	print(this.ApiStore.GetVersionAsync(key, versions.GetCurrentPage()[0].Version));

	// 	return (data as unknown as Schema) ?? this.template; // fix later lol
	// }

	StartSessionAsync(key: string): SchemaStoreSession<Schema> {
		return new SchemaStoreSession(this.ApiStore, key, this.template);
	}
}
