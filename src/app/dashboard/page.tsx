import { getConnectionInfo } from "@rb/elastic";

export default async function Home() {
  const connectionData = await getConnectionInfo();
  return (
    <main>
      <div>
        <h1>Dashboard!</h1>
        {connectionData.connected ? (
          <p>Connected to cluster {connectionData.clusterName}</p>
        ) : (
          <p>Not connected</p>
        )}
      </div>
    </main>
  );
}
