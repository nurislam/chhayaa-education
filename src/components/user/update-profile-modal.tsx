import React, { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styled from "@emotion/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import FormLabel from "@mui/material/FormLabel";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { UsersType } from "@utils/generated";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UpdateUsersInfo } from "@data/user/use-user-list.query";
import { TextField } from "@mui/material";

const FormGroup = styled.div`
  margin-bottom: 30px;
  min-width: 400px;
`;
const UpdateBtn = styled(LoadingButton)`
  background-color: #729e5a;
  font-weight: 700;
  padding: 12px 15px 10px;
  color: #fff;
  text-transform: capitalize;
  &:hover {
    background-color: "var(--primary)";
  }
`;

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const formSchema = yup.object().shape({
  firstName: yup.string().trim().required("First name is a required field."),
  lastName: yup.string().trim().required("Last name is a required field."),
  username: yup.string().trim().required("User name is a required field."),
  email: yup.string().trim().required("Email is a required field."),
});
const defaultValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
};
interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: UsersType;
  isPending: any;
}
const UpdateProfileModal: React.FC<IProps> = ({
  open,
  setOpen,
  isPending,
  data,
}) => {
  const { mutate: update, isPaused: isLoading } = UpdateUsersInfo();

  const { 
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(formSchema) });

  const handleClose = () => {
    setOpen(false);
  };

  const formSubmit = (data: any) => {     

    update(data, {
      onSuccess: () => {
        toast.success(`You have successfully updated your profile.`);
        setOpen(false);
        isPending();
      },
      onError: (error: any) => {
        toast.error(error.response.data?.error?.message);
      },
    });
  };

  useEffect(() => {
    if (data?.firstName && open) {
      const fields = ["firstName", "lastName", "username", "email"];
      fields.forEach((field: any) => setValue(field, (data as any)[field]));
      clearErrors();
    }
  }, [data, open, setValue, clearErrors]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Update Profile
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormGroup>
            <FormLabel>First Name</FormLabel>
            <TextField
              name="firstName"
              required={true} 
              value={watch("firstName")}
              error={errors.firstName ? true : false} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Last Name</FormLabel>
            <TextField
              value={watch("lastName")}
              name="lastName"
              required={true} 
              error={errors.lastName ? true : false} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>User Name</FormLabel>
            <TextField
              value={watch("username")}
              name="username"
              required={true}
              disabled={true} 
              error={errors.username ? true : false} 
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <TextField
              value={watch("email")}
              name="email"
              required={true} 
              type="email"
              error={errors.email ? true : false} 
            />
          </FormGroup>
          <FormGroup>
            <UpdateBtn type="submit" loading={isLoading}>
              Save changes
            </UpdateBtn>
          </FormGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateProfileModal;
