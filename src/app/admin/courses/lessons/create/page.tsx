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
import { useCreateLessonMutation } from "@data/lessons/use-lessons.query";
import {  useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getAuthCredentials } from "@/utils/auth-utils";
import { useCoursesQuery } from "@/data/courses/use-courses.query";


type FormValues = {
  name: string;
  identifier: string;
  details: string;
  courseId: string; 
  status: string;   
};

const schema = yup.object().shape({
  name: yup.string().required("Title is required"),
  identifier: yup.string().required("Identifier is required"),
  details: yup.string().required("Content is required"),
  courseId: yup.string().required("Course is required"), 
  status: yup.string().default(""), 
});

export default function PostCreateForm() {
  
  const router = useRouter();
  const { mutate: createPost } = useCreateLessonMutation();
  const credentials = getAuthCredentials();
 
   const {
      data: courses = [],
      isPending,
      refetch: refetchPosts,
    } = useCoursesQuery({});

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
      identifier: "",
      details: "",
      courseId: "", 
      status: "", 
    },
  });

  // Auto-generate identifier from name
  const titleValue = watch("name");
  React.useEffect(() => {
    const generatedIdentifier = titleValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setValue("identifier", generatedIdentifier);
  }, [titleValue, setValue]);

  const onSubmit = async (data: any) => {
    const DataType = {
      courseId: Number(data.courseId),
      identifier: data.identifier,
      name: data.name,
      details: data.details,   
      createdBy: credentials?.id || "",
      createdAt:new Date(),
      status: data.status,   
    };
    createPost(DataType, {
      onSuccess: () => {
        toast.success("Post created successfully!");
        router.push("/admin/courses/lessons");
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
        Add New Lesson
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <TextField
            fullWidth
            label="Name"
            {...register("name")}
            required
            sx={{ mb: 2 }}
            error={!!errors.name}
            helperText={errors.name?.message}
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
              {...register("details")}
              error={!!errors.details}
              helperText={errors.details?.message}
            />
          </Box>
       
        <Grid item xs={12} md={3}>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.courseId}>
            <InputLabel>Course</InputLabel>
            <Select
              label="Course"
              {...register("courseId")}
              value={watch("courseId")}
              onChange={(e) => setValue("courseId", e.target.value)}
              required
            >
              {courses.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.title}
                </MenuItem>
              ))}
            </Select>
            {errors.courseId?.message && (
              <Typography color="error" variant="caption">
                {errors.courseId.message}
              </Typography>
            )}
          </FormControl>
           
           
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              {...register("status")}
              value={watch("status")}
              onChange={(e) => setValue("status", e.target.value)}
              required
            >
              <MenuItem value="active"> Active</MenuItem>
              <MenuItem value="inactive"> Inactive </MenuItem> 
            </Select>
            {errors.status?.message && (
              <Typography color="error" variant="caption">
                {errors.status.message}
              </Typography>
            )}
          </FormControl>
         
        </Grid>
      </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
