import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";

interface IChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversations";
  imageUrl?: string;
}
export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: IChatHeaderProps) => {
  return (
    <div className="flex items-center h-12 px-3 text-md font-semibold border-b-2 border-neutral-200 dark:border-neutral-800">
      <MobileToggle serverId={serverId}/>
      {type === "channel" && (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">
        {name}
      </p>
    </div>
  );
};
