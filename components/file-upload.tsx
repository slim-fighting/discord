import { UploadDropzone } from "@/lib/uploading";
import Image from "next/image";
interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: 'messageFile' | 'serverImage';
}

const FileUpload = ({ onChange, endpoint, value }: FileUploadProps) => {
  const fileType  = value?.split('.').pop();
  if(value && fileType !== 'pdf') {
    return (
        <div className="relative h-20 w-20">
            <Image 
              fill
              src={value}
              alt="Upload"
              className="rounded-full"  />
        </div>
    )
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