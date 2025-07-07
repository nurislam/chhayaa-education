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
import { useCreateCoursesMutation } from "@data/courses/use-courses.query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";

type FormValues = {
  title: string;
  identifier: string;
  content: string;
  categoryId: string;
  TotalStudents: number;
  totalLesson: number;
  status: string;
  featured?: File | null;
  instructorId: string;
  price: number;
  duration: string;
  language: string;
  certificate: string;
  rating: number;
};

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  identifier: yup.string().required("Identifier is required"),
  content: yup.string().required("Content is required"),
  categoryId: yup.string().required("Category is required"),
  featured: yup
    .mixed<File>()
    .nullable()
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true; // allow empty
      return value instanceof File && value.type.startsWith("image/");
    }),
  TotalStudents: yup.number().required().default(0),
  totalLesson: yup.number().required().default(0),
  status: yup.string().default(""),
  instructorId: yup.string().required("Instructor is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be >= 0"),
  duration: yup.string().required("Duration is required"),
  language: yup.string().required("Language is required"),
  certificate: yup.string().required("Certificate info is required"),
  rating: yup.number().required("Rating is required").min(0).max(5),
});

export default function PostCreateForm() {
  const router = useRouter();
  const { mutate: createPost } = useCreateCoursesMutation();
  const credentials = getAuthCredentials();
  const { data: categories = [] } = useCategoryQuery({
    where: { categoryType: "course", deleted: false },
    order: ["categoryName ASC"],
  });

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
      categoryId: "",
      TotalStudents: 0,
      totalLesson: 0,
      status: "",
      featured: null,
      instructorId: "1",
      price: 0,
      duration: "",
      language: "",
      certificate: "",
      rating: 0,
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
      categoryId: Number(data.categoryId),
      identifier: data.identifier,
      title: data.title,
      content: data.content,
      TotalStudents: data.TotalStudents,
      totalLesson: data.totalLesson,
      featured: "", // handle file upload separately if needed
      imageUrl: "",
      createdBy: credentials?.id || "",
      status: data.status,
      instructorId: Number(data.instructorId),
      price: data.price,
      duration: data.duration,
      language: data.language,
      certificate: data.certificate,
      rating: data.rating,
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
      <Typography variant="h5" mb={2}>
        Add New Courses
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
            label="Identifier"
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
              Featured Image
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
            label="Price"
            type="number"
            {...register("price")}
            sx={{ mb: 2 }}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            fullWidth
            label="Duration"
            {...register("duration")}
            sx={{ mb: 2 }}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />
          <TextField
            fullWidth
            label="Language"
            {...register("language")}
            sx={{ mb: 2 }}
            error={!!errors.language}
            helperText={errors.language?.message}
          />
          <TextField
            fullWidth
            label="Certificate"
            {...register("certificate")}
            sx={{ mb: 2 }}
            error={!!errors.certificate}
            helperText={errors.certificate?.message}
          />
          <TextField
            fullWidth
            label="Rating"
            type="number"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
            {...register("rating")}
            sx={{ mb: 2 }}
            error={!!errors.rating}
            helperText={errors.rating?.message}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              {...register("categoryId")}
              value={watch("categoryId")}
              onChange={(e) => setValue("categoryId", e.target.value)}
              required
            >
              {categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId?.message && (
              <Typography color="error" variant="caption">
                {errors.categoryId.message}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Total Students"
            type="number"
            {...register("TotalStudents")}
            sx={{ mb: 2 }}
            error={!!errors.TotalStudents}
            helperText={errors.TotalStudents?.message}
          />
          <TextField
            fullWidth
            label="Total Lessons"
            type="number"
            {...register("totalLesson")}
            sx={{ mb: 2 }}
            error={!!errors.totalLesson}
            helperText={errors.totalLesson?.message}
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
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.instructorId}>
            <InputLabel>Instructor</InputLabel>
            <Select
              label="Instructor"
              {...register("instructorId")}
              value={watch("instructorId")}
              onChange={(e) => setValue("instructorId", e.target.value)}
              required
            >
              <MenuItem value="1">John Doe</MenuItem>
              <MenuItem value="2">Jane Smith</MenuItem>
              <MenuItem value="3">Alex Johnson</MenuItem>
            </Select>
            {errors.instructorId?.message && (
              <Typography color="error" variant="caption">
                {errors.instructorId.message}
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
