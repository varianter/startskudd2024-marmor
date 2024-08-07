import {Card, CardContent, CardTitle} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { connect } from "@/elastic";
import { TriangleAlert } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import RiskNotification from "@/app/dashboard/RiskNotification";

export const revalidate = 20;


const DELTA_MOVEMENT_THRESHOLD_MM = 5;
const SENSOR_DEPTH_THRESHOLD_M = 1;
const RISK_DISPLACEMENTS_COUNT_THRESHOLD = 10;


export default async function Dashboard() {
    const client = await connect();

    const sensorDangerSearch = await client.count({
        index: "sensor_readings",
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
    })

    const sensorDisplacementCount = sensorDangerSearch.count
    const sensorIsDanger = sensorDisplacementCount >= RISK_DISPLACEMENTS_COUNT_THRESHOLD;

    const sensorTotalCount = 20;  // TODO
    const sensorOkCount = 18;  // TODO (number of sensors with status='ON')

    const sensorStatus = await client.search({
        size:0,
        index:"sensor_readings",
        "aggs": {
            "latest": {
                "terms": {
                    "size":100,
                    "field": "sensorId",

                },
                "aggs": {
                    "latest": {
                        "top_hits": {
                            "sort": {
                                "readingDate":"desc",
                            },
                            "size": 1
                        }

                    }
                }
            }
        }
    })

    // @ts-ignore
    const sensors = sensorStatus.aggregations?.["latest"]["buckets"]

    // @ts-ignore
    function sortSensorsById(sensorList:any) {
        return sensorList.sort((a:any, b:any) => {
            const sensorIdA = parseInt(a.key.split('-')[1], 10);
            const sensorIdB = parseInt(b.key.split('-')[1], 10);
            return sensorIdA - sensorIdB;
        });
    }
    const sortedBuckets = sortSensorsById(sensors)
    // @ts-ignore
    const sensorDangerCount = sensorDangerSearch.aggregations?.["sensors"]["buckets"].length


    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">

        <RiskNotification isDanger={sensorIsDanger} />

        <Typography variant="h1">Dashboard</Typography>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
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
            <div></div>
            <div><div className="text-base">Oversikt sensorer</div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] tableHeadFont">Sensornavn</TableHead>
                            <TableHead className="tableHeadFont">Status</TableHead>
                            <TableHead className="tableHeadFont" >Siste måling (mm)</TableHead>
                            {/* <TableHead>Posisjon(x,y,z)</TableHead> */}
                            <TableHead className="tableHeadFont">Sist søk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedBuckets.map((sensor:any) => {
                            let sensorInfo = sensor["latest"]["hits"]["hits"][0]["_source"]
                            let placement = sensorInfo["sensor"]["placement"]
                            let date = new Date(sensorInfo["readingDate"])
                            return <TableRow key={sensor["key"]}>
                                <TableCell>{sensor["key"]}</TableCell>
                                <TableCell>{sensorInfo["status"]}</TableCell>
                                <TableCell>{sensorInfo["status"] == "ON" ? Number((sensorInfo["deltaMovementInMm"]).toFixed(2)): "-"}</TableCell>
                                {/* <TableCell>({placement["x"]},{placement["y"]},{placement["depthInMeter"]})</TableCell> */}
                                <TableCell>{date.toUTCString()}</TableCell>
                            </TableRow>
                        })}

                    </TableBody>
                </Table>
            </div>
        </div>
    </main>;
}
