import { fetchCategoryPosts } from "@data/posts/use-posts.query";
import { getserverAuth } from "@utils/api/actions";
import { Box } from "@mui/material";
import CategoryWisePostList from "./catListPage";

export default async function BlogCatWise({
  params,
}: {
  params: Promise<{ identifier: string; view?: string | undefined }>;
}) {
  const ctx = getserverAuth();

  const { identifier, view } = await params; // ✅ this is now valid
  const posts = await fetchCategoryPosts(identifier, ctx);
  const viewMode = view === "list" ? "list" : "grid";

  return (
    <Box p={3}>
      <CategoryWisePostList viewMode={viewMode} posts={posts} />
    </Box>
  );
}
