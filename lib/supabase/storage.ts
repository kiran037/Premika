import { supabase } from "./client";

export interface UploadResult {
    url: string;
    path: string;
}

export async function uploadImage(
    file: File,
    bucket: string,
    folder = ""
): Promise<UploadResult> {
    const extension = file.name.split(".").pop();

    const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const path = folder
        ? `${folder}/${filename}`
        : filename;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return {
        url: data.publicUrl,
        path,
    };
}

export async function deleteImage(
    bucket: string,
    path: string
) {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        throw new Error(error.message);
    }
}

export function getPublicUrl(
    bucket: string,
    path: string
) {
    return supabase.storage
        .from(bucket)
        .getPublicUrl(path).data.publicUrl;
}