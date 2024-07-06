"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Socket } from "socket.io";

interface IChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    }
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "ADMIN":<ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>
}

const formSchema = z.object({
    content: z.string().min(1)
})
export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: IChatItemProps) => {
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (!isAdmin || !isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && fileUrl;
    const fileType = fileUrl?.split(".").pop();
    const isPDF = fileType === "pdf";
    const isImage = !isPDF && fileUrl;
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        content: content,
      },
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          });
          await axios.patch(url, values);
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(()=> {
      form.reset({
        content: content
      })
    },[content]);

    useEffect(()=> {
        const handleKeyDown = (event:any) =>{ 
            if(event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    },[]);

  return (
    <div className="group w-full flex items-center relative p-4 hover:bg-black/5 transition">
      <div className="group flex items-start gap-x-2 w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-48 w-48 flex items-center aspect-square rounded-md mt-2 overflow-hidden bg-secondary"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center mt-2 p-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_black"
                rel="noopener noreferrer"
                className="text-sm ml-2 text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-500 dark:text-zinc-300",
                deleted && "italic text-zinc-500 dark:text-zinc-400 text-sm mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
                <form
                    className="flex items-center gap-x-2 w-full pt-2" 
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField 
                        control={form.control}
                        name="content"
                        render={({field}) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <div className="w-full relative">
                                        <Input 
                                            disabled={isLoading}
                                            className="p-2 border-none border-0 bg-zinc-200/90 dark:bg-zinc-700/50 
                                            focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                            placeholder="Edit Message"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>

                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} size="sm" variant="primary">
                        Save
                    </Button>
                </form>
                <span className="text-[10px] mt-1 text-zinc-400">
                    Press escape to cancel, enter to save
                </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 border rounded-sm
          absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800"
        >
          {canDeleteMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-z-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => setIsDeleting(true)}
              className="cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-z-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};