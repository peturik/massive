export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  tags: string;
  image_url: string;
  gallery: string;
  status: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}
export interface Tag {
  id: string;
  title: string;
  rate: number;
}
