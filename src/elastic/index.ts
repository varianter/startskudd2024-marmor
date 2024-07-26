import { connect, INDEX_NAME } from "./client";
export * from "./client";

type ConnectionInfoReturn =
  | {
      connected: false;
    }
  | {
      connected: true;
      clusterName: string;
    };
export async function getConnectionInfo(): Promise<ConnectionInfoReturn> {
  try {
    const client = await connect();
    const data = await client.info();
    return {
      connected: true,
      clusterName: data.cluster_name,
    };
  } catch (e) {
    console.error(e);
    return {
      connected: false,
    };
  }
}
