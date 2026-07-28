export interface ImageUploaderProps {
  bucket: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
}

export interface UploadProgress {
  isUploading: boolean;
  error?: string | null;
}
