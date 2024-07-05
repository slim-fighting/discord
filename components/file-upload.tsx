import { UploadDropzone } from "@/lib/uploading";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({ onChange, endpoint, value }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button 
          className="absolute top-0 right-0 shadow-sm bg-rose-500 rounded-full text-white p-1" 
          onClick={() => onChange("")} 
          type="button">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
    if (value && fileType === "pdf") {
      return (
        <div className="relative flex items-center mt-2 p-2 rounded-md bg-background/10">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a
            href={value}
            target="_black"
            rel="noopener noreferrer"
            className="text-sm ml-2 text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            {value}
          </a>
          <button
            className="absolute -top-2 -right-2 shadow-sm bg-rose-500 rounded-full text-white p-1"
            onClick={() => onChange("")}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
