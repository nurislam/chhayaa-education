import React from "react";
import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export interface BootstrapDialogProps extends DialogProps {
  customMaxWidth?: string;
}

export const BootstrapDialogTitle = (props: DialogTitleProps) => {
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
            top: 14,
            color: "var(--themeColor)",
            fontSize: "30px",
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "30px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialog: React.FC<BootstrapDialogProps> = ({ maxWidth, children, ...props }) => {
  return (
    <CustomDialog
      {...props}
      maxWidth={false}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: maxWidth || "700px",
          width: "100%",
          margin: "auto",
        },
      }}
    >
      {children}
    </CustomDialog>
  );
};

export default BootstrapDialog;
