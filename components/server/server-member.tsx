"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface IServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="h-4 w-4 ml-2 text-rose-500"/>,
  [MemberRole.MODERATOR]: <ShieldAlert className="h-6 w-6 ml-2 text-indigo-500"/>,
};
export const ServerMember = ({ server, member }: IServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  return (
    <button
      className={cn(
        "group w-full flex items-center gap-x-2 mb-1 px-2 py-2 rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        className="h-8 w-8 md:h-8 md:w-8"
        src={member.profile.imageUrl}
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
