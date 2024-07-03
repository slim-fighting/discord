"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface IServerSearchProps {
    data: {
        label:string;
        type: "channel" | "member";
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}
export const ServerSearch = ({
    data
}: IServerSearchProps) => {
    const [open,setOpen] = useState(false);
    const params = useParams();
    const router = useRouter();
    useEffect(()=> {
        const down = (e:KeyboardEvent)=> {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.stopPropagation();
                setOpen(open=>!open);
            }
        }
        document.addEventListener("keydown", down);
        document.removeEventListener("keydown", down);
    },[]);

    const onClick = ({ type, id }:{type: "channel" | "member";id: string}) => {
        setOpen(false);
        if(type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }
        if(type==="channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}` );
        }
    }
    return (
      <>
        <button
          className="group w-full flex items-center gap-x-2 px-2 py-2 transition
          rounded-md hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
          onClick={()=>setOpen(true)}
        >
          <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <p
            className="font-semibold text-sm text-zinc-500 dark:text-zinc-400
            group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
          >
            Search
          </p>
          <kbd 
            className="h-5 inline-flex items-center gap-1 
            pointer-events-none select-none rounded border bg-muted
            px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
          >
            <span>CMD</span>K
          </kbd>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search all channels and members"/>
            <CommandList>
                <CommandEmpty>
                    No Results found
                </CommandEmpty>
                {data.map(({type, data, label}) => {
                    if(!data?.length) return null;
                    return (
                        <CommandGroup key={label} heading={label}>
                            {data?.map(({id, icon, name})=> {
                                return (
                                    <CommandItem key={id} onSelect={() => onClick({type, id})}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
      </>
    );
}