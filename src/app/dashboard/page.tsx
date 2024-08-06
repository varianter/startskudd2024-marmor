import {Card, CardContent, CardTitle} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { connect, getConnectionInfo } from "@/elastic";
import { TriangleAlert } from 'lucide-react';

export const revalidate = 20;


const DELTA_MOVEMENT_THRESHOLD_MM = 0.5;    // TODO: verify this
const SENSOR_DEPTH_THRESHOLD_M = 1;
const RISK_DISPLACEMENTS_COUNT_THRESHOLD = 10;


export default async function Dashboard() {
  const client = await connect();
  const connectionData = await getConnectionInfo();
  const numberOfDocuments = connectionData.connected
    ? await client.count()
    : null;

    const sensorDangerSearch = await client.search({
        index: "sensor_readings",
        size: 0,    // only return aggregated results (not details from each reading)
        query: {
            bool: {
                must: [
                    {
                        range: {
                            "deltaMovementInMm": {
                                gt: DELTA_MOVEMENT_THRESHOLD_MM,
                            },
                        }
                    },
                    {
                        range: {
                            "readingPlacement.depthInMeter": {
                                gte: SENSOR_DEPTH_THRESHOLD_M,
                            },
                        }
                    },
                    {
                        range: {
                            "readingDate": {
                                gt: "now-24h",
                            },
                        }
                    }
                ]
            }
        },
        // sort: [
        //   {
        //     "readingDate": "desc"
        //   }
        // ],
        aggs: {
            "sensors": {
                "terms": {
                    "field": "sensorId",
                    "min_doc_count": RISK_DISPLACEMENTS_COUNT_THRESHOLD,
                }
            }
        }
    })

    // @ts-ignore
    const sensorDangerCount = sensorDangerSearch.aggregations?.["sensors"]["buckets"].length
    const sensorIsDanger = sensorDangerCount > 0;

    const sensorTotalCount = 20;  // TODO
    const sensorOkCount = 18;  // TODO

    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Typography variant="h1">Dashboard</Typography>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            {/*<Card x-chunk="dashboard-01-chunk-5">*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle className="gap-2 flex">*/}
            {/*            Connection status*/}
            {/*            {connectionData.connected ? (*/}
            {/*                <Badge variant="default">Connected</Badge>*/}
            {/*            ) : (*/}
            {/*                <Badge variant="destructive">Not connected</Badge>*/}
            {/*            )}*/}
            {/*        </CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="grid gap-8">*/}
            {/*        {connectionData.connected ? (*/}
            {/*            <p>*/}
            {/*                Connected to cluster{" "}*/}
            {/*                <code className="bg-slate-200 p-1 font-mono rounded-sm">*/}
            {/*                    {connectionData.clusterName}*/}
            {/*                </code>*/}
            {/*                . Counting {numberOfDocuments?.count} documents*/}
            {/*            </p>*/}
            {/*        ) : (*/}
            {/*            <p>Not connected</p>*/}
            {/*        )}*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
            <Card className={sensorIsDanger ? "border-red-600 border-4" : ""}>
                <CardContent>
                    <div className={"flex flex-row mt-5 gap-5"}>
                        {sensorIsDanger ? (
                            <TriangleAlert fill={"#DC2626"} size={50} stroke={"white"} />) : (
                            <div
                                className={`me-1 rounded-full h-12 w-12 flex items-center justify-center ${(sensorIsDanger ? 'bg-red-600' : 'bg-emerald-400')}`}>
                            </div>
                        )}
                        <div className={"flex flex-col gap-3 mt-1"}>
                            <CardTitle className={"text-3xl"}>
                                <p>{sensorIsDanger ? "Rasfare" : "Ingen rasfare"}</p>
                            </CardTitle>
                            <p>Dette er basert på data innhentet fra <strong>{sensorOkCount} av {sensorTotalCount}</strong> sensorer.</p>
                        </div>
                    </div>
                    {/*<p><code className="bg-slate-200 p-1 font-mono rounded-sm">*/}
                    {/*    {sensorDangerCount}*/}
                    {/*</code> sensor{sensorDangerCount == 1 ? "" : "s"} detecting significant displacement</p>*/}
                </CardContent>
            </Card>
        </div>
    </main>;
}
