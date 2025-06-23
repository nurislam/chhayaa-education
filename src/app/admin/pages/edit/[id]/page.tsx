"use client";

import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Skeleton } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { UpdatePagesInfo, usePagesQuery } from "@/data/pages/use-pages.query";
import { getAuthCredentials } from "@/utils/auth-utils";
import { useEffect } from "react";
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), { ssr: false });

interface PageForm {
  title: string;
  identifier: string;
  content: string;
  createdBy: string;
  status: number;
}

export default function EditPage() {
  const router = useRouter();
  const { id } = useParams();
  const credentials = getAuthCredentials();
  const creator = credentials?.permissions[0];

  const { data: pageData = null, isLoading } = usePagesQuery({
    where: { id: parseInt(id as string), deleted: false },
  });

  const { mutate: updatePage, isPending } = UpdatePagesInfo();

  const { control, handleSubmit, setValue } = useForm<PageForm>({
    defaultValues: {
      title: pageData?.[0]?.title || "",
      identifier: pageData?.[0]?.identifier || "",
      content: pageData?.[0]?.content || "",
      createdBy: creator,
      status: pageData?.[0]?.status || 1,
    },
  });

  useEffect(() => {
    if (pageData) {
      setValue("title", pageData[0].title);
      setValue("identifier", pageData[0].identifier);
      setValue("content", pageData[0].content);
      setValue("status", pageData[0].status);
    }
  }, [pageData, setValue]);

  // Generate identifier from title on change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const generatedIdentifier = newTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("identifier", generatedIdentifier);
    return newTitle;
  };

  const onSubmit = (data: PageForm) => {
    updatePage(
      { id: parseInt(id as string), ...data },
      {
        onSuccess: () => {
          toast.success("Page updated successfully!");
          router.push("/admin/pages");
        },
        onError: () => {
          toast.error("Failed to update page. Please try again." ); 
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Edit Page
        </Typography>
        <Skeleton variant="text" width="80%" height={40} />
        <Skeleton variant="text" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Edit Page
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                required
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(handleTitleChange(e))} 
              />
            )}
          />
          <Controller
            name="identifier"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Identifier (Slug)"
                variant="outlined"
                required
                fullWidth
                helperText="This will be the URL slug (e.g., 'about' for /about)"
                disabled
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel shrink>Content</InputLabel>
                <QuillEditor value={field.value} onChange={field.onChange} />
              </Box>
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value={1}>Pending</MenuItem> 
                  <MenuItem value={2}>Published</MenuItem>
                  <MenuItem value={3}>Draft</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={isPending} sx={{ mt: 2 }}>
            {isPending ? "Updating..." : "Update Page"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
