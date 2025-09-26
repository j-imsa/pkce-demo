import { useEffect, useState } from "react";

type LeaderMessageType = "LEADER_ALIVE" | "WHO_IS_LEADER" | "I_AM_LEADER" | "LEADER_DEAD";

type LeaderMessage = {
    type: LeaderMessageType;
    id: string;
};

type UseSingleTabEnforcerOptions = {
    channelName?: string;
};

type UseSingleTabEnforcerReturn = {
    isLeader: boolean;
    otherOpen: boolean;
};

export function useSingleTabEnforcer(
    { channelName = "my-app-tab" }: UseSingleTabEnforcerOptions = {}
): UseSingleTabEnforcerReturn {
    const [isLeader, setIsLeader] = useState<boolean>(false);
    const [otherOpen, setOtherOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!("BroadcastChannel" in window)) {
            return;
        }

        const bc = new BroadcastChannel(channelName);
        const myId = Math.random().toString(36).slice(2);
        let leaderId: string | null = null;
        let aliveInterval: ReturnType<typeof setInterval> | null = null;

        const onMessage = (ev: MessageEvent<LeaderMessage>) => {
            const { type, id } = ev.data || { type: undefined, id: "" as string };

            if (type === "LEADER_ALIVE") {
                leaderId = id;
                if (leaderId !== myId) {
                    setOtherOpen(true);
                }
            } else if (type === "WHO_IS_LEADER") {
                if (isLeader) bc.postMessage({ type: "LEADER_ALIVE", id: myId } satisfies LeaderMessage);
            } else if (type === "I_AM_LEADER") {
                leaderId = id;
                if (leaderId !== myId) setOtherOpen(true);
            }
        };

        bc.onmessage = onMessage;

        // Ask who is leader
        bc.postMessage({ type: "WHO_IS_LEADER", id: myId } as LeaderMessage);

        // If no answer within 200ms, become leader
        const t = setTimeout(() => {
            if (!leaderId) {
                setIsLeader(true);
                bc.postMessage({ type: "I_AM_LEADER", id: myId } as LeaderMessage);
                // heartbeat
                aliveInterval = setInterval(() => {
                    bc.postMessage({ type: "LEADER_ALIVE", id: myId } as LeaderMessage);
                }, 1000);
            }
        }, 200);

        const cleanup = () => {
            clearTimeout(t);
            if (aliveInterval) clearInterval(aliveInterval);
            bc.postMessage({ type: "LEADER_DEAD", id: myId } as LeaderMessage);
            bc.close();
        };

        window.addEventListener("beforeunload", cleanup);
        return () => {
            cleanup();
            window.removeEventListener("beforeunload", cleanup);
        };
    }, [channelName, isLeader]);

    return { isLeader, otherOpen };
}