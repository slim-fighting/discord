import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();
        if(!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });
        return Response.json(server);
        
    } catch (error) {
        console.error("SERVER_ID_PATCH", error);
        return new Response("Interval Error", { status: 500 })
    }
}