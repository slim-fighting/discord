"use client";

import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2 } from "lucide-react";
import { Fragment } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";

const DATE_FORMAT = "d MM yyyy, HH:mm";
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}
interface IChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}
export const ChatMessage = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: IChatMessageProps) => {
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading message ...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Something went wrong !
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
      <div className="flex-1"></div>
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i)=> (
            <Fragment key={i}>
                {group.items.map((message: MessageWithMemberWithProfile)=> (
                    <ChatItem 
                        key={message.id}
                        id={message.id}
                        member={message.member}
                        content={message.content}
                        currentMember={member}
                        fileUrl={message.fileUrl}
                        deleted={message.deleted}
                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                        isUpdated={message.updatedAt !== message.createdAt}
                        socketUrl={socketUrl}
                        socketQuery={socketQuery}
                    />
                ))}
            </Fragment>
        ))}
      </div>
    </div>
  );
};