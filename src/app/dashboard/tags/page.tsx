import { createClient } from "@/lib/supabase/server";

export default async function Tags() {
  const supabase = await createClient();

  const { data: tags } = await supabase.from("tags").select("*");

  const { data: posts } = await supabase.from("posts").select("tags");
  const postsTags = posts?.map((post) => post.tags);
  const count = postsTags?.join().split(",");

  const c = count?.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
  console.log(c);

  return (
    <div>
      <h1>Tags</h1>
      {tags?.map((tag) => (
        <div key={tag.id}>
          <h2>{tag.title}</h2>
        </div>
      ))}
    </div>
  );
}
