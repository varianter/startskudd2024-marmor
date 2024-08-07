"use server"


import {connect} from "@/elastic";

const DELTA_MOVEMENT_THRESHOLD_MM = 5;
const SENSOR_DEPTH_THRESHOLD_M = 1;

export async function doSensorDangerSearch(index: string) {

    const client = await connect();

    return client.count({
        index: index,
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
                                gt: "now-3h",
                            },
                        }
                    }
                ]
            }
        },
    })
}

export async function doSensorStatusSearch(index: string) {
    const client = await connect();

    return client.search({
        size:0,
        index: index,
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
}