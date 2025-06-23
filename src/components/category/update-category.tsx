"use client";
import React, { useEffect, useState, useMemo } from "react";
import { DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BootstrapDialog, {
  BootstrapDialogTitle,
} from "@components/ui/bootstrap-dialog";
import OutlinedInputField from "@components/ui/out-lined-input-field";
import SaveButton from "@components/ui/save-button";
import { useUpdateCategoryInfo } from "@data/category/use-category.query";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import CustomCheckbox from "@components/ui/custom-checkbox";
import SelectMd from "@components/ui/select-md";
import { toast } from "react-toastify";

export const CATEGORY_STATUS = [
  { name: "Active", value: "active" },
  { name: "Inactive", value: "inactive" },
];
// Validation schema
const schema = Yup.object({
  categoryName: Yup.string().required("Category Name is required"),
  categoryDescription: Yup.string().required(
    "Category Description is required"
  ),
  identifier: Yup.string().optional(),
});

interface UpdateCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryData: any[];
  currentCategory: any;
  refetch: () => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryProps> = ({
  open,
  setOpen,
  categoryData,
  currentCategory,
  refetch,
}) => {
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [statusCategory, setStatusCategory] = useState("");

  const router = useRouter(); 

  const { mutate: updateCategory, isPending: loading } =
    useUpdateCategoryInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (currentCategory) {
      reset({
        categoryName: currentCategory.categoryName,
        categoryDescription: currentCategory.categoryDescription,
        identifier: currentCategory.identifier,
      });

      setIsSubcategory(!!currentCategory.parentId);
      setParentCategory(currentCategory.parentId || "");
      setStatusCategory(currentCategory.status);
    }
  }, [currentCategory, reset]);

  const handleClose = () => setOpen(false);

  const onSubmit = (data: any) => {
    const updatedData: any = {
      ...data,
      id: currentCategory.id,
      categoryType: currentCategory.categoryType, 
      updatedAt: new Date(),
      parentId: isSubcategory ? Number(parentCategory) : 0,
      status: statusCategory,
    };

   
    updateCategory(updatedData, {
      onSuccess: () => {
        refetch();
        toast.success("Category updated successfully");
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        toast.error(`Error updating category: ${error.message}`);
      },
    });
  };

  const filteredCategories = useMemo(() => {
    return categoryData?.filter(
      (category: any) => category.id !== currentCategory?.id
    );
  }, [categoryData, currentCategory]);

  return (
    <BootstrapDialog open={open} onClose={handleClose}>
      <BootstrapDialogTitle id="update-category-dialog" onClose={handleClose}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "50px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaEdit color="var(--primary)" />
            &nbsp; Update Category
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
            {...register("categoryName")}
          />

          <OutlinedInputField
            name="identifier"
            label="Category Identifier"
            disabled={true}
            register={register}
            error={errors.identifier?.message}
            helperText={errors.identifier?.message}
          />

          <OutlinedInputField
            name="categoryDescription"
            label="Category Description"
            register={register}
            error={errors.categoryDescription?.message}
            helperText={errors.categoryDescription?.message}
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
                setSelect={setParentCategory}
                placeholder="Select parent category"
                size="15px"
              />
            </div>
          )}
          <div style={{ margin: "15px 0 20px" }}>
            <SelectMd
              options={CATEGORY_STATUS}
              selectedOption={statusCategory ?? ""}
              placeholder="Category Status"
              color="#fff"
              setSelect={(value: string) => setStatusCategory(value)}
              size="15px"
            />
          </div>
          <SaveButton type="submit" loading={loading} variant="contained">
            Update Category
          </SaveButton>
        </form>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default UpdateCategoryModal;
