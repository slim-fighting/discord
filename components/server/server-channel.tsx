"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface IServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: IServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const Icon = iconMap[channel.type];
  const { onOpen } = useModal();
  return (
    <button
      className={cn(
        "group w-full flex items-center gap-x-2 mb-1 px-2 py-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "text-sm font-semibold line-clamp-1 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group:hover: text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit
              className="h-4 w-4 group-hover:block hidden text-zinc-500 hover:text-zinc-600
             dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={()=> onOpen("editChannel", { channel })}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="h-4 w-4 group-hover:block hidden text-zinc-500 hover:text-zinc-600
             dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={()=> onOpen("deleteChannel", { channel })}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="h-4 w-4 ml-auto text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};