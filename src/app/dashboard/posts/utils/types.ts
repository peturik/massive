import { Database } from "@/lib/supabase/database.types";

export type Posts = Database["public"]["Tables"]["posts"]["Row"];
export type Tags = Database["public"]["Tables"]["tags"]["Row"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

type PostTagLink = {
  tags: Tags | null;
};

export interface PostTags extends Posts {
  posts_tags: PostTagLink[];
}
// export interface Post {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   body: string;
//   tags: string;
//   image_url: string;
//   gallery: string;
//   status: number;
//   created_at: string;
//   updated_at: string;
//   user_id: string;
//   posts_tags: Posts_Tags[];
// }
// export interface Tag {
//   id: string;
//   title: string;
//   rate: number;
// }
//

//export type PostTags = Posts & {
//  posts_tags: PostTagLink[];
//};
