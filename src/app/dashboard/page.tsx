"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
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
import {doSensorDangerSearch, doSensorStatusSearch} from "@/actions/searchActions";
import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {QueryClient, useQuery} from "@tanstack/react-query";

const RISK_DISPLACEMENTS_COUNT_THRESHOLD = 10;

const queryClient = new QueryClient();


export default function Dashboard() {

    const [sensorIndex, setSensorIndex] = useState<string>("sensor_readings");

    const sensorDangerQuery = useQuery({queryKey: ["sensorDanger", sensorIndex], refetchInterval: 1000, queryFn: ({queryKey}) => {
        return doSensorDangerSearch(queryKey[1])
    }}, queryClient)

    const sensorStatusQuery = useQuery({queryKey: ["sensorStatus", sensorIndex], refetchInterval: 1000, queryFn: ({queryKey}) => {
            return doSensorStatusSearch(queryKey[1])
        }}, queryClient)

    const sensorDisplacementCount = sensorDangerQuery.data?.count ?? 0
    const sensorIsDanger = sensorDisplacementCount >= RISK_DISPLACEMENTS_COUNT_THRESHOLD;

    // @ts-ignore
    const sensors = sensorStatusQuery.data?.aggregations?.["latest"]["buckets"]
    const sensorTotalCount = sensors?.length ?? 0;
    // @ts-ignore
    const sensorOkCount = sensors?.filter(elem => elem["latest"]["hits"]["hits"][0]["_source"]["status"]=="ON").length ?? 0;

    // @ts-ignore
    function sortSensorsById(sensorList:any) {
        if (!sensorList) return sensorList;
        return sensorList.sort((a:any, b:any) => {
            const sensorIdA = parseInt(a.key.split('-')[1], 10);
            const sensorIdB = parseInt(b.key.split('-')[1], 10);
            return sensorIdA - sensorIdB;
        });
    }
    const sortedBuckets = sortSensorsById(sensors)

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
                                className={`me-1 mt-3 rounded-full h-6 w-6 flex items-center justify-center ${(sensorIsDanger ? 'bg-red-600' : 'bg-emerald-400')}`}>
                            </div>
                        )}
                        <div className={"flex flex-col gap-3 mt-1"}>
                            <CardTitle className={"text-3xl"}>
                                <p>{sensorIsDanger ? "Rasfare" : "Ingen rasfare"}</p>
                            </CardTitle>
                            <p>Dette er basert på data innhentet fra <strong>{sensorOkCount} av {sensorTotalCount}</strong> sensorer.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div></div>
            <div>
                <div className="text-2xl text-extrabold bold ">Oversikt sensorer</div>
                <Table className="border">
                    <TableHeader>
                        <TableRow>
                            <TableHead className=" border w-[100px] text-right tableHeadFont mr-6">Sensornavn</TableHead>
                            <TableHead className=" border tableHeadFont pr-3 w-1/6 pl-20">Status</TableHead>
                            <TableHead className=" border tableHeadFont text-right pl-0 ml-0 " >Posisjonsendring (mm)</TableHead>
                            {/* <TableHead>Posisjon(x,y,z)</TableHead> */}
                            <TableHead className=" border tableHeadFont text-right">Sist søk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedBuckets && sortedBuckets.map((sensor:any) => {
                            let sensorInfo = sensor["latest"]["hits"]["hits"][0]["_source"]
                            let placement = sensorInfo["sensor"]["placement"]
                            let date = new Date(sensorInfo["readingDate"])
                            let change = Number((sensorInfo["deltaMovementInMm"])).toFixed(3)
                            change = change.replace(/\./g, ',')
                            return <TableRow key={sensor["key"]}>
                                <TableCell className=" border text-right">{sensor["key"]}</TableCell>
                                <TableCell className="right flex items-stretch"><div className="marginauto text-right text-right flex items-stretch">{sensorInfo["status"]}<div
                                className={`text-right me-1 mt-5px ml-2 rounded-full h-2.5 w-2.5 flex  ${(sensorInfo["status"] == "ON" ? 'bg-emerald-400' : (sensorInfo["status"] == "ERROR" ? 'bg-red-600' : 'bg-slate-300' ))}`}>
                            </div></div>
                            </TableCell>
                                <TableCell className=" border text-right pl-0 ml-0">{sensorInfo["status"] == "ON" ? change : "-"}</TableCell>
                                {/* <TableCell>({placement["x"]},{placement["y"]},{placement["depthInMeter"]})</TableCell> */}
                                <TableCell className="border text-right">{date.toLocaleDateString("nb-NO")} kl.{date.toLocaleTimeString("nb-NO")}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
        <div className={"flex justify-end"}>
            <Badge variant={"outline"} className={"px-4 py-2"}>
                <label className="Label" htmlFor="airplane-mode" style={{paddingRight: 15}}>
                    Staging
                </label>
                <Switch onCheckedChange={(pressed) => {
                    setSensorIndex(pressed ? "sensor_readings_staging" : "sensor_readings");
                }}>Staging</Switch>
            </Badge>
        </div>
    </main>;
}
