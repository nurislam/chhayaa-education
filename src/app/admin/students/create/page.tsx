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
import React from "react";
import { useCategoryQuery } from "@data/category/use-category.query";
import { useRouter } from "next/navigation";
import { useCreateStudentMutation } from "@data/students/use-students.query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";

type FormValues = {
  title: string;
  identifier: string;
  content: string;
  status?: string;
  featured?: File | null;
  imageUrl?: string;
  TotalCourse?: string;
};

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  identifier: yup.string().required("Identifier is required"),
  content: yup.string().required("Content is required"),
  featured: yup
    .mixed<File>()
    .nullable()
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      return value instanceof File && value.type.startsWith("image/");
    }),
});

export default function PostCreateForm() {
  const router = useRouter();
  const { mutate: createPost } = useCreateStudentMutation();
  const credentials = getAuthCredentials();
  
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      identifier: "",
      content: "",
      imageUrl: "",
      status: "",
      featured: null,
      TotalCourse: "",
    },
  });

  // Auto-generate identifier from title
  const titleValue = watch("title");
  React.useEffect(() => {
    const generatedIdentifier = titleValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setValue("identifier", generatedIdentifier);
  }, [titleValue, setValue]);

  const onSubmit = async (data: any) => {
    const postData = { 
      identifier: data.identifier,
      title: data.title,
      content: data.content,
      TotalCourse: "",
      featured: "",
      imageUrl: data.imageUrl,
      createdBy: credentials?.id || "",
      status: data.status,
    };
    createPost(postData, {
      onSuccess: () => {
        toast.success("Post created successfully!");
        router.push("/admin/students");
      },
      onError: (error: any) => {
        toast.error(
          `Error creating post, '${error?.response?.data?.error.message}'- Please try again.`
        );
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
      <Typography variant="h5" mb={2}>
        Add New Student
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Title"
            {...register("title")}
            required
            sx={{ mb: 2 }}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth 
            {...register("identifier")}
            required
            sx={{ mb: 2 }}
            helperText={
              errors.identifier?.message ||
              "This will be the URL slug (e.g., 'Today news' for /today-news)"
            }
            error={!!errors.identifier}
          />
          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Content
            </Typography>
            <TextField
              fullWidth
              label="Content"
              multiline
              minRows={4}
              {...register("content")}
              error={!!errors.content}
              helperText={errors.content?.message}
            />
          </Box>
          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Profile Photo
            </Typography>
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              )}
            />
          </Box>

          <TextField
            fullWidth
            label="Image URL"
            {...register("imageUrl")}
            sx={{ mb: 2 }}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
          />

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              {...register("status")}
              value={watch("status")}
              onChange={(e) => setValue("status", e.target.value)}
              required
            >
              <MenuItem value="pending"> Pending</MenuItem>
              <MenuItem value="draft"> Draft </MenuItem>
              <MenuItem value="published"> Published</MenuItem>
              <MenuItem value="deleted"> Deleted</MenuItem>
            </Select>
            {errors.status?.message && (
              <Typography color="error" variant="caption">
                {errors.status.message}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
