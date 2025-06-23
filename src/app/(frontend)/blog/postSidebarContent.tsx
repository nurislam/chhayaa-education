"use client"; 
import { Box, Typography, List, ListItem, ListItemText, Link } from "@mui/material";
import { FaCaretRight } from "react-icons/fa";
import SearchBox from "./searchBox";

type SidebarProps = {
  categories: any[];
  tagsData: any[];
};

export default function PostSidebarContent({ categories, tagsData }: SidebarProps) {
   
  
  // const filteredCategories = categories.filter((cat) =>
  //   cat.categoryName.toLowerCase().includes(categories.toLowerCase())
  // );

  return (
    <Box p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
      <Typography variant="h6">Search</Typography>
      <SearchBox />

      <Typography variant="h6" sx={{ mt: 0 }}>Categories</Typography>
      {categories.length > 0 ? (
        <List sx={{ maxHeight: "200px", overflowY: "auto" }}>
          {categories.map((category) => (
            <ListItem key={category.id} sx={{ paddingY: "2px" }}>
              <Link href={`/category/${category.identifier}`} underline="hover" style={{ display: "flex", alignItems: "center" }}>
                <FaCaretRight size={14} style={{ marginRight: "8px", color: "#555" }} />
                <ListItemText primary={category.categoryName} />
              </Link>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No categories match.</Typography>
      )}

      <Typography variant="h6" sx={{ mt: 1 }}>Tags</Typography>
      <List sx={{ display: "flex", flexWrap: "wrap" }}>
        {tagsData.map((tag) => (
          <ListItem key={tag.id} sx={{ width: "auto", padding: "4px 8px" }}>
            <Link href={`/tag/${tag.identifier}`} underline="hover">
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#e0e0e0",
                  borderRadius: "16px",
                  padding: "4px 8px",
                }}
              >
                {tag.name}
              </Typography>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
