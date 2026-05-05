import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";

export const usePost = () => {
  const { user } = useAuth();

  const createPost = async (imageUri: string, description?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      // Upload image to Supabase Storage
      const postImageUrl = await uploadPostImage(user.id, imageUri);

      // Calculate how long post will take to expire
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 60 * 60 * 24 * 1000); // 1 day (24 hours)

      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: postImageUrl,
          description: description || null,
          expires_at: expiresAt,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    } catch (error) {
      console.log("Error creating post:", error);
      throw error;
    }
  };

  return { createPost };
};
