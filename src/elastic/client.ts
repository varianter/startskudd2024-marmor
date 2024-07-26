import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { Client } from "@elastic/elasticsearch";

export const INDEX_NAME = "sensor_readings";

export type ElasticClient = Client;

let client: ElasticClient | null = null;

export async function connect() {
  if (client) {
    return client;
  }

  const vaultName = process.env.KeyVault_Name;

  if (!vaultName) {
    throw new Error("KeyVault_Name is not set.");
  }
  const credential = new DefaultAzureCredential();

  const url = `https://${vaultName}.vault.azure.net/`;

  const keyVaultClient = new SecretClient(url, credential);
  const secretApiKey = await keyVaultClient.getSecret("ElasticSearchApiKey");
  const secretUrl = await keyVaultClient.getSecret("ElasticSearchUrl");

  if (!secretUrl.value || !secretApiKey.value) {
    throw new Error("Secrets not found.");
  }

  console.info(`Connecting to ${secretUrl.value}`);

  client = new Client({
    node: secretUrl.value,
    auth: {
      apiKey: secretApiKey.value,
    },
  });

  return client;
}
