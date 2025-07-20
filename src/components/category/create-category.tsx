"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  DialogContent,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BootstrapDialog, {
  BootstrapDialogTitle,
} from "@/components/ui/bootstrap-dialog";
import OutlinedInputField from "@/components/ui/out-lined-input-field";
import SaveButton from "@/components/ui/save-button";
import { useCreateCategoryMutation } from "@/data/category/use-category.query";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import SelectMd from "@components/ui/select-md";
import { BiPlusMedical } from "react-icons/bi";
import { getAuthCredentials } from "@/utils/auth-utils";
import { toast } from "react-toastify";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";

const FilterArea = styled(Box)`
  display: flex;
  justify-content: space-between;
  column-gap: 20px;
`;

// Define the schema using Yup for validation
const schema = Yup.object({
  categoryName: Yup.string().required("Category Name is required"),
  categoryDescription: Yup.string().required(
    "Category Description is required"
  ),
  cat_icon: Yup.string().optional(),
  identifier: Yup.string().optional(),
});

interface CreateCategoryProps {
  categoryData: any;
  setSearch: (setSearch: string) => void;
  search: any;
  refetch: any;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  categoryData,
  setSearch,
  search,
  refetch,
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [identifierAuto, setIdentifier] = useState("");

  const authCredentials = getAuthCredentials();
  const userId = authCredentials?.id;

  const { mutate: createCategory, isPending: loading } =
    useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
      cat_icon: "",
      identifier: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const newCategory: any = {
      categoryName: data.categoryName,
      cat_icon: data.cat_icon,
      categoryDescription: data.categoryDescription,
      identifier: data.identifier ? data.identifier : identifierAuto,
      createdBy: userId,
    };

    if (isSubcategory && parentCategory) {
      newCategory.parentId = Number(parentCategory);
    }

    createCategory(newCategory, {
      onSuccess: () => {
        reset();
        refetch();
        toast.success("Category created successfully");
        setIsSubcategory(false);
        setParentCategory("");
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(`Error creating category: ${error.message}`);
      },
    });
  };

  // Filter categories based on the search query
  const filteredCategories = useMemo(() => {
    return categoryData?.filter((category: any) =>
      category.categoryName.toLowerCase().includes(search.toLowerCase())
    );
  }, [categoryData, search]);

  const handleIdentifierChange = (categoryName: string) => {
    const generatedIdentifier = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setIdentifier(generatedIdentifier);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        justifyContent={"space-between"}
        flexWrap="wrap"
        marginBottom="12px"
      >
        <FilterArea>
          <TextField
            placeholder="Search Category"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "100%", maxWidth: 300 }}
            InputProps={{
              style: {
                height: "40px",
                padding: "15px",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </FilterArea>
        <Button
          onClick={handleClickOpen}
          startIcon={<BiPlusMedical size={14} />}
          variant="contained"
          color="primary"
          sx={{ whiteSpace: "nowrap" }}
        >
          <Typography variant="button" color="white">
            Add Category
          </Typography>
        </Button>
      </Box>

      {/* Modal Dialog for Category Creation */}
      <BootstrapDialog open={open} onClose={handleClose}>
        <BootstrapDialogTitle id="create-category-dialog" onClose={handleClose}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: "50px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <FaCheckCircle color="var(--primary)" />
              &nbsp; Add Category
            </span>
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)}>
            <OutlinedInputField
              label="Category Name"
              register={register}
              error={errors.categoryName?.message}
              helperText={errors.categoryName?.message}
              {...register("categoryName", {
                onChange: (e) => handleIdentifierChange(e.target.value),
              })}
            />
            {identifierAuto && (
              <Typography border={"1px solid #CCC"} padding={1}>
                {" "}
                Slug: {identifierAuto}
              </Typography>
            )}
            <OutlinedInputField
              name="identifier"
              label="Category Identifier"
              register={register}
              error={errors.identifier?.message}
              helperText={errors.identifier?.message}
              value={identifierAuto}
            />
            <OutlinedInputField
              name="categoryDescription"
              label="Category Description"
              register={register}
              error={errors.categoryDescription?.message}
              helperText={errors.categoryDescription?.message}
            />
            <OutlinedInputField
              name="cat_icon"
              label="Category Icon"
              register={register}
              error={errors.cat_icon?.message}
              helperText={errors.cat_icon?.message}
            />
            <CustomCheckbox
              onChange={setIsSubcategory}
              value={isSubcategory}
              label="Make as subcategory"
            />
            {isSubcategory && (
              <div style={{ margin: "15px 0 0" }}>
                <SelectMd
                  options={filteredCategories?.map((item: any) => ({
                    value: item.id,
                    name: item.categoryName,
                  }))}
                  selectedOption={parentCategory}
                  color="#fff"
                  setSelect={(value: string) => setParentCategory(value)}
                  placeholder="Select parent category"
                  size="15px"
                />
              </div>
            )}

            <SaveButton type="submit" loading={loading} variant="contained">
              Create Category
            </SaveButton>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default CreateCategory;
