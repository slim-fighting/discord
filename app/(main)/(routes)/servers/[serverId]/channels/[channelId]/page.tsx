import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { channel } from "diagnostics_channel";
import { redirect } from "next/navigation";

interface IChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: IChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
        serverId: params.serverId,
        profileId: profile.id
    }
  });
  if(!channel || !member) {
    redirect("/");
  }
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
        <ChatHeader
            type="channel"
            name={channel.name}
            serverId={params.serverId}
        />
        <div className="flex-1">Feature messages</div>
        <ChatInput 
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId
          }}
        />
    </div>
  );
};

export default ChannelIdPage;
