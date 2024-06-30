import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");
        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new Response("ServerId Missing", { status: 400 });
        }
        if (!params.memberId) {
            return new Response("Members Id Missing", { status: 400 });
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role: role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });
        return Response.json(server);
    } catch (err) {
        console.log("[MEMBER_ID_PATCH]", err);
        return new Response("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!profile) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (!serverId) {
            return new Response("ServerId Missing", { status: 400 });
        }
        if (!params.memberId) {
            return new Response("Member Id Missing", { status: 400 });
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    delete: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });
        return Response.json(server);
    } catch (err) {
        console.error("MEMBER_ID_DELETE", err);
        return new Response("Internal Error", { status: 500 });
    }
}