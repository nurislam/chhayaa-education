import { fetchPostsData } from "@/data/posts/use-posts.query";
import BlogPage from "./blogPage";
import { getserverAuth } from "@utils/api/actions";
import { Box } from "@mui/material"; 


export default async function BlogPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | undefined }>;
}) {
  const ctx = getserverAuth();
  
  const { view } = await searchParams; 
  const viewMode = view === "list" ? "list" : "grid"; 

  // Fetch initial posts
  const posts = await fetchPostsData(
    {
      where: {  deleted: false , postStatus: "published" },
      include: [
        {
          relation: "category",
          scope: { fields: { id: true, identifier: true, categoryName: true } },
        },
        {
          relation: "tags",
          scope: {
            fields: { id: true, identifier: true, postId: true, name: true },
          },
        },
      ],
      order: ["createdAt DESC"],
    },
    ctx
  );

  return (
    <Box p={3}>
      <BlogPage viewMode={viewMode} posts={posts} />
    </Box>
  );
}
