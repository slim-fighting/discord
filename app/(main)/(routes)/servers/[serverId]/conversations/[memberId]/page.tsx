import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IMmemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

const MemberIdPage = async ({params}: IMmemberIdPageProps) => {
    const profile = await currentProfile();
    if(!profile) {
        return redirectToSignIn();
    }
    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    });
    if(!currentMember) {
        return redirect("/");
    }
    const conversations = await getOrCreateConversation(currentMember.id,params.memberId);
    if(!conversations) {
        return redirect(`/servers/${params.serverId}`);
    }
    const { memberOne, memberTwo } = conversations;
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
        <ChatHeader
            imageUrl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
        />
    </div>
  )
};

export default MemberIdPage;
