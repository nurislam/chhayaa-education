"use client";
import React, { useState } from "react"; 
import {  Typography, Button, DialogContent } from "@mui/material"; 
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BootstrapDialog, { BootstrapDialogTitle } from "@/components/ui/bootstrap-dialog";
import OutlinedInputField from "@/components/ui/out-lined-input-field";
import SaveButton from "@/components/ui/save-button";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { useCreateCompanyMutation } from "@/data/products/use-company.query";
import { BiPlusMedical } from "react-icons/bi";
import { toast } from "react-toastify";

const schema = Yup.object({
  name: Yup.string().required("Company Name is required"),
  address: Yup.string().required("Company address is required"),
});

const CreateCompany: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: createCompany, isPending: loading } = useCreateCompanyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const newCompany: any = {
      name: data.name,
      address: data.address,
      createdBy: "admin",
    };

    createCompany(newCompany, {
      onSuccess: () => {
        reset();
        setOpen(false);
        router.refresh();
      },
      onError: (error: any) => {
        // Handle error
        toast.error("Error creating category:", error);
      },
    });
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        startIcon={<BiPlusMedical size={14} />}
        variant="contained"
        color="primary"
        sx={{ marginLeft: "auto", display: "flex" }}
      >
        <Typography variant="button" color="white">
          Add Company
        </Typography>
      </Button>

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
              &nbsp; Add Company
            </span>
          </div>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit)}>
            <OutlinedInputField
              name="name"
              label="Name"
              register={register}
              error={errors.name?.message}
              helperText={errors.name?.message}
            />
            <OutlinedInputField
              name="address"
              label="Address"
              register={register}
              error={errors.address?.message}
              helperText={errors.address?.message}
            />

            <SaveButton type="submit" loading={loading} variant="contained">
              Create Company
            </SaveButton>
          </form>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default CreateCompany;
