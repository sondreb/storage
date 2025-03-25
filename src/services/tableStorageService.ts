// import { TableClient, TableEntity, TableServiceClient } from "@azure/data-tables";
// import { v4 as uuidv4 } from "uuid";

// export interface StorageEntity extends TableEntity {
//   content: string;
// }

// export class TableStorageService {
//   private tableClient: TableClient;
//   private tableServiceClient: TableServiceClient;
//   private readonly tableName = "data";

//   constructor() {
//     const connectionString = process.env.StorageAccount || "";
    
//     // Create table client
//     this.tableServiceClient = TableServiceClient.fromConnectionString(connectionString);

//     // Create table client
//     this.tableClient = TableClient.fromConnectionString(connectionString, this.tableName);
    
//     // Ensure table exists
//     this.initialize();
//   }

//   private async initialize(): Promise<void> {
//     try {
//       await this.tableServiceClient.createTable(this.tableName);
//     } catch (error) {
//       console.error("Failed to initialize table:", error);
//       throw error;
//     }
//   }

//   public async storeJsonData(data: any): Promise<string> {
//     try {
//       const rowKey = uuidv4();
//       const entity: StorageEntity = {
//         partitionKey: "freeid",
//         rowKey: rowKey,
//         content: JSON.stringify(data)
//       };

//       await this.tableClient.createEntity(entity);
//       return rowKey;
//     } catch (error) {
//       console.error("Failed to store data:", error);
//       throw error;
//     }
//   }
// }
