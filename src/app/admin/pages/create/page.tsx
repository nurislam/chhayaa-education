"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreatePagesMutation } from "@data/pages/use-pages.query";
import { getAuthCredentials } from "@utils/auth-utils";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("@components/ui/quill-editor"), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={292} />,
});

interface PageForm {
  title: string;
  identifier: string;
  content: string;
  createdBy: string;
  status: number;
}

export default function CreatePage() {
  const router = useRouter();
  const credentials = getAuthCredentials();
  const creator = credentials?.permissions[0];
  const { mutate: createPage, isPending } = useCreatePagesMutation();
  const { control, handleSubmit, setValue } = useForm<PageForm>({
    defaultValues: {
      title: "",
      identifier: "",
      content: "",
      createdBy: creator,
      status: 1,
    },
  });

  const handleFormSubmit = (data: PageForm) => {
    createPage(data, {
      onSuccess: () => {
        toast.success("Page created successfully!");
        router.push("/admin/pages");
      },
      onError: () => {
        toast.error("Failed to create page. Please try again.");
      },
    });
  };

  const handleIdentifierChange = (title: string) => {
    const generatedIdentifier = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("identifier", generatedIdentifier);
  };

  return (
    <Box sx={{ p: 2}}>
      <Typography variant="h5" mb={2}>
        Create New Page
      </Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                onChange={(e) => {
                  field.onChange(e);
                  handleIdentifierChange(e.target.value);
                }}
                required
                fullWidth
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
                  <MenuItem value={0}>Draft</MenuItem>
                  <MenuItem value={1}>Published</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          
          
        </Box>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            sx={{ mt: 2 }}
          >
            {isPending ? "Creating..." : "Create Page"}
          </Button>
      </form>
    </Box>
  );
}
