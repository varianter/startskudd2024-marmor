import {Card, CardContent, CardTitle} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { connect } from "@/elastic";
import { TriangleAlert } from 'lucide-react';

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

    return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
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
        </div>
    </main>;
}
