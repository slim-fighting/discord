"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";

interface INavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
export const NavigationItem = ({
  id,
  name,
  imageUrl,
}: INavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  const onClick = () => router.push(`/servers/${id}`);
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group flex items-center relative" onClick={onClick}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        ></div>
        <div
          className={cn(
            "group relative flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};
