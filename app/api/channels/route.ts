import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(
    req: Request
) {
    try {
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const { name, type } = await req.json();
        const profile = await currentProfile();
        if(!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if(!serverId) {
            return new Response("Server Id Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });
        return Response.json(server);
    } catch(err) {
        console.log("CHANNEL_POST", err);
        return new Response("Internal Error", { status: 500 });
    }
}