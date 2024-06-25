"use client";
import * as Z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import FileUpload from "@/components/file-upload";

const formSchema = Z.object({
  name: Z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: Z.string().min(1, {
    message: "Image URL is required.",
  }),
});
const InitialModal = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: Z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Dialog open>
      <DialogContent className=" bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a name and an image. You can change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex text-center items-center justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className=" uppercase text-xs font-bold text-zinc-500
                            dark:text-secondary/70"
                    >
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter server name"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
