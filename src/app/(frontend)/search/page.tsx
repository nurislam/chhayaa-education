import { fetchPostsData } from "@data/posts/use-posts.query"; // <- adjust to your fetch
import { Box, Typography, List, ListItem, Link } from "@mui/material";
 

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | undefined }>;
}) {


  const { q = "" } = await searchParams;
  const query = q;

  const allPosts = await fetchPostsData({ where: { deleted: false } });

  const posts = allPosts.filter((post: any) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Search results for: {query}
      </Typography>

      {posts.length > 0 ? (
        <List>
          {posts.map((post: any) => (
            <ListItem key={post.id} >
              <Typography variant="h6" sx={{textAlign: 'left'}}>
                <Link href={`/blog/${post.identifier}`} underline="hover">
                  {post.title}
                </Link>

              </Typography>
             
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No posts found.</Typography>
      )}
    </Box>
  );
}
