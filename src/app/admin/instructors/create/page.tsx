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
import { useRouter } from "next/navigation";
import { useCreateInstructorsMutation } from "@data/instructors/use-instructors";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";

type FormValues = {
  name: string;
  designation: string;
  identifier: string;
  content: string;
  status: string;
  rating?: number;
  featured?: string;
  imageUrl?: string;
  totalCourse?: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  designation: yup.string().required("Designation is required"),
  identifier: yup.string().required("Identifier is required"),
  content: yup.string().required("Content is required"),
  status: yup.string().required("Status is required"),
   
});

export default function PostCreateForm() {
  const router = useRouter();
  const { mutate: createPost } = useCreateInstructorsMutation();
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
      name: "",
      designation: "",
      identifier: "",
      rating: 0,
      content: "",
      imageUrl: "",
      status: "",
      featured: "",
      totalCourse: "",
    },
  });

  const nameValue = watch("name");
  const statusValue = watch("status");

  React.useEffect(() => {
    const generatedIdentifier = nameValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setValue("identifier", generatedIdentifier);
  }, [nameValue, setValue]);

  const onSubmit = async (data: FormValues) => {
    const postData = {
      identifier: data.identifier,
      name: data.name,
      designation: data.designation,
      content: data.content,
      totalCourse: Number(data.totalCourse) || 0,  
      featured:data.featured,  
      imageUrl: data.imageUrl,
      createdBy: credentials?.id || "",
      status: data.status,
    };

    createPost(postData, {
      onSuccess: () => {
        toast.success("Instructor created successfully!");
        router.push("/admin/instructors");
      },
      onError: (error: any) => {
        toast.error(
          `Error creating instructor: '${error?.response?.data?.error?.message}'`
        );
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} p={3}>
      <Typography variant="h5" mb={2}>
        Add New Instructor
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Designation"
            {...register("designation")}
            error={!!errors.designation}
            helperText={errors.designation?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            {...register("identifier")}
            error={!!errors.identifier}
            helperText={
              errors.identifier?.message ||
              "Auto-generated from name. Used for URL slug."
            }
            sx={{ mb: 2 }}
          />

          <Box mb={2}>
            <Typography variant="body1" gutterBottom>
              Content
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Content"
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
            {errors.featured?.message && (
              <Typography color="error" variant="caption">
                {errors.featured.message}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label="Image URL"
            {...register("imageUrl")}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Total Course"
            {...register("totalCourse")}
            error={!!errors.totalCourse}
            helperText={errors.totalCourse?.message}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusValue}
              onChange={(e) => setValue("status", e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
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
