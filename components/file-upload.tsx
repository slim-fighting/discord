import { UploadDropzone } from "@/lib/uploading";
import { X } from "lucide-react";
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
