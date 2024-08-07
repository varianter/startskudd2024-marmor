"use client"

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

export default function RiskNotification({isDanger}: {isDanger: boolean}) {

    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

    function sendRiskNotification() {
        const not: Notification = new Notification('Rasfare!', {
            body: 'Vegen bør holdes stengt',
            icon: "https://startskudd2024-marmor.vercel.app/icon.svg",
            silent: false
        });
        setTimeout(not.close.bind(not), 3000);
    }

    async function requestNotificationPermission() {
        if (Notification.permission === 'default' || Notification.permission === 'denied') {
            const res = await Notification.requestPermission()
            setNotificationPermission(res);
        }
    }

    const [isNotificationSent, setIsNotificationSent] = useState(false);

    useEffect(() => {
        setNotificationPermission(Notification.permission)
    }, []);

    useEffect(() => {
        if (!isDanger) {
            setIsNotificationSent(false);
            return;
        }
        if (!isNotificationSent) {
            setIsNotificationSent(true);
            sendRiskNotification();
        }
    }, [isDanger])

    switch (notificationPermission) {
        case "denied":
            return <Badge variant={"destructive"}>Varslinger deaktivert</Badge>
        case null:
        case "granted":
            return <></>
    }

    return <Button onClick={requestNotificationPermission}>
        Aktiver app-varsling
    </Button>

}