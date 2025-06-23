// PostSidebar.tsx (Server Component)
import { getserverAuth } from "@utils/api/actions";
import { fetchTagsData } from "@data/posts/use-posts.query";
import { fetchCategoryData } from "@data/category/use-category.query"; 
import PostSidebarContent from "./postSidebarContent";

const PostSidebar = async () => {
  const ctx = getserverAuth();

  const [categories, tagsData] = await Promise.all([
    fetchCategoryData(
      {
        where: { deleted: false, categoryType: "post" },
        order: ["createdAt DESC"],
      },
      ctx
    ),
    fetchTagsData({ where: { deleted: false }, order: ["name ASC"] }, ctx),
  ]);

   // Ensure uniqueness by filtering duplicate tags based on their name
   const uniqueTags = Array.from(new Set(tagsData.map((tag: any) => tag.name)))
   .map((name) => tagsData.find((tag: any) => tag.name === name))
   .filter(Boolean);

  return <PostSidebarContent categories={categories} tagsData={uniqueTags} />;
};

export default PostSidebar;
