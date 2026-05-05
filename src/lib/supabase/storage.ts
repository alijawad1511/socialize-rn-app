import { File } from "expo-file-system";
import { supabase } from "./client";

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  if (!userId) {
    console.error("User ID is required to upload profile image");
    return;
  }

  try {
    // Get image extension
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/profile.${fileExtension}`;
    const file = new File(imageUri);
    const bytes = await file.bytes();

    const { error } = await supabase.storage
      .from("profiles")
      .upload(fileName, bytes, {
        contentType: `image/${fileExtension}`,
        upsert: true, // Insert if not exists, update if exists
      });

    if (error) throw error;

    const { data: url } = await supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return url.publicUrl;
  } catch (error) {
    console.log("Error uploading profile image:", error);
    throw error;
  }
};

export const uploadPostImage = async (userId: string, imageUri: string) => {
  try {
    // Get image extension
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/post.${fileExtension}`;
    const file = new File(imageUri);
    const bytes = await file.bytes();

    const { error } = await supabase.storage
      .from("posts")
      .upload(fileName, bytes, {
        contentType: `image/${fileExtension}`,
        upsert: true, // Insert if not exists, update if exists
      });

    if (error) throw error;

    const { data: url } = await supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    return url.publicUrl;
  } catch (error) {
    console.log("Error uploading post image:", error);
    throw error;
  }
};
