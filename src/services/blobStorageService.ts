import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export class BlobStorageService {
  private containerClient: ContainerClient;
  private readonly containerName = "data";

  constructor() {
    const connectionString = process.env.StorageAccount || "";
    
    // Create blob service client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Get container client
    this.containerClient = blobServiceClient.getContainerClient(this.containerName);
    
    // Ensure container exists
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.containerClient.createIfNotExists();
    } catch (error) {
      console.error("Failed to initialize container:", error);
      throw error;
    }
  }

  public async storeJsonData(data: any): Promise<string> {
    try {
      const blobId = uuidv4();
      const blobName = `freeid/${blobId}.json`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      
      // Convert data to JSON string
      const content = JSON.stringify(data);
      
      // Upload JSON content as text
      await blockBlobClient.upload(content, content.length, {
        blobHTTPHeaders: {
          blobContentType: "application/json"
        }
      });
      
      return blobId;
    } catch (error) {
      console.error("Failed to store data:", error);
      throw error;
    }
  }
}
