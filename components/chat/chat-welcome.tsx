"use client";

import { Hash } from "lucide-react";

interface IChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}

export const ChatWelcome = ({
    name,
    type
}: IChatWelcomeProps) => {
    return (
        <div className="px-4 mb-4 space-y-2">
            {type === "channel" && (
                <div className="h-[75px] w-[75px] flex items-center justify-center rounded-full bg-zinc-500 dark:bg-zine-400">
                    <Hash className="h-12 w-12 text-white"/>
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type ==="channel" ? "Welcome to #" : ""} {name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type==="channel" ? `This is the start of the #${name} channel.` : `This is the start of your conversation with ${name}`}
            </p>
        </div>
    )
}