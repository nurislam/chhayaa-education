import { fetchTagPosts } from "@data/posts/use-posts.query";
import { getserverAuth } from "@/utils/api/actions";
import { Box } from "@mui/material";
import TagWisePostList from "./tagWisePost";

export default async function BlogDetailsCatWise({
  params,
  searchParams,
}: {
  params: Promise<{ identifier: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const ctx = getserverAuth();
  const { identifier } = await params; // ✅ this is now valid
  const { view } = await searchParams; // ✅ await this too
  const posts = await fetchTagPosts(identifier, ctx);
  const viewMode = view === "list" ? "list" : "grid"; 
  
  return (
    <Box p={3}>
      <TagWisePostList viewMode={viewMode} posts={posts} />
    </Box>
  );
}
