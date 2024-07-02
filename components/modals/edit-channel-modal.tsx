"use client"

import * as Z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";


const formSchema = Z.object({
  name: Z.string().min(1, {
    message: "Channel name is required.",
  }).refine(
    name => name !=="general",
    {
      message: "Channel name can't be 'general'"
    }
  ),
  type: Z.nativeEnum(ChannelType)
});
export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();
  const { channel } = data;
  const form = useForm({
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (channel) {
      form.setValue("type", channel.type);
      form.setValue("name", channel.name);
    }
  },[form, channel]);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: Z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.patch(url, values);
      onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
    } 
  };
  const isModalOpen = isOpen && type === "editChannel";
  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className=" bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className=" uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Channel name"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="type"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger 
                          className="text-black bg-zinc-300/50 border-0
                          focus:ring-0 ring-offset-0 outline-none
                          focus:ring-offset-0 capitalize"
                        >
                          <SelectValue placeholder="Select a channel type"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        { Object.values(ChannelType).map(type=>(
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
