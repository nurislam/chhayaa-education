"use client";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useCategoryQuery } from "@data/category/use-category.query";
import { useRouter } from "next/navigation";
import { useCreateCoursesMutation } from "@data/courses/use-courses.query";
import { Autocomplete, Chip } from "@mui/material";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";

// Load QuillEditor dynamically to avoid SSR issues
const QuillEditor = dynamic(() => import("@components/ui/quill-editor"), {
  ssr: false,
});

export default function PostCreateForm() {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState<File | null>(null);
  const [tagNames, setTagIds] = useState<string[]>([]);

  const { mutate: createPost } = useCreateCoursesMutation();
  const credentials = getAuthCredentials();

  const { data: categories = [] } = useCategoryQuery({
    where: { categoryType: "course", deleted: false },
    order: ["categoryName ASC"],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const generatedIdentifier = newTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w-]+/g, ""); // Remove special characters (optional)

    setIdentifier(generatedIdentifier);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      categoryId: Number(categoryId),
      identifier,
      title,
      content,
      TotalStudents: 0,
      totalLesson: 0,
      featured: "",
      imageUrl: "",
      createdBy: credentials?.id || "", // Ensure createdBy is always a string
      status: "active",
    };

    createPost(postData, {
      onSuccess: () => {
        toast.success("Post created successfully!");
        router.push("/admin/courses");
      },
      onError: (error: any) => {
        toast.error(
          `Error creating post, '${error?.response?.data?.error.message}'- Please try again.`
        );
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Typography variant="h5" mb={2}>
        Add New Courses
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={handleTitleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            sx={{ mb: 2 }}
            helperText="This will be the URL slug (e.g., 'Today news' for /today-news)"
          />

          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Content
            </Typography>
            <QuillEditor value={content} onChange={setContent} />
          </Box>

          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Featured Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFeatured(e.target.files ? e.target.files[0] : null)
              }
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
              required
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
