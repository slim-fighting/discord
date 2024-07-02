import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if(!serverId) {
            return new Response("Server Id is Missing", { status: 400 });
        }

        if (!params.channelId) {
            return new Response("Channel Id is Missing", { status: 400 });
        }
        const server  = await db.server.update({
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });
        return Response.json(server);
    } catch (err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return new Response("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const { name, type } = await req.json();
        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new Response("Server Id is Missing", { status: 400 });
        }
        if (!params.channelId) {
            return new Response("Channel Id is Missing", { status: 400 });
        }
        if(name === "general") {
            return new Response("Name cannot be 'general'", { status: 400 });
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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name,
                            type
                        }
                        
                    }
                }
            }
        });
        return Response.json(server);
    } catch (err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return new Response("Internal Error", { status: 500 });
    }
}