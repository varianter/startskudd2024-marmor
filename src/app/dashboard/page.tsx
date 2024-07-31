import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { connect, getConnectionInfo } from "@/elastic";

export const revalidate = 20;

export default async function Dashboard() {
  const client = await connect();
  const connectionData = await getConnectionInfo();
  const numberOfDocuments = connectionData.connected
    ? await client.count()
    : null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Typography variant="h1">Dashboard</Typography>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle className="gap-2 flex">
              Connection status
              {connectionData.connected ? (
                <Badge variant="default">Connected</Badge>
              ) : (
                <Badge variant="destructive">Not connected</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {connectionData.connected ? (
              <p>
                Connected to cluster{" "}
                <code className="bg-slate-200 p-1 font-mono rounded-sm">
                  {connectionData.clusterName}
                </code>
                . Counting {numberOfDocuments?.count} documents
              </p>
            ) : (
              <p>Not connected</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
