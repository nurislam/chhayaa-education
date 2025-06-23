import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IconButton } from "@mui/material";

interface IParam {
  confirmation: (open: boolean) => void;
  autoOpen?: boolean;
  parentOpen?: boolean;
  setParentOpen?: (newOpen: boolean) => void;
  text?: string;
  button?: React.ReactNode;
  title?: string;
  body?: string;
  canSave: boolean;
  htmlBody?: React.ReactNode;
  children?: React.ReactNode;
  successBtnText?: string;
}

const ConfirmationDialog: React.FC<IParam> = ({
  confirmation,
  autoOpen,
  parentOpen,
  setParentOpen,
  text,
  button,
  title,
  body,
  canSave = true,
  children,
  htmlBody,
  successBtnText,
}) => {
  const [open, setOpenRaw] = React.useState(!!(autoOpen || parentOpen));

  // force open if autoOpen or parentOpen are changed
  useEffect(() => {
    setOpenRaw(!!(autoOpen || parentOpen));
  }, [autoOpen, parentOpen]);

  // override the default setOpen hook so we can open/close on the parent if required
  const setOpen = (newOpen: boolean) => {
    if (setParentOpen) {
      setParentOpen(newOpen);
    } else {
      setOpenRaw(newOpen);
    }
  };

  // can be closed in multiple ways
  const handleClose = () => {
    confirmation(false);
    setOpen(false);
  };

  return (
    <>
      {!autoOpen && (
        <div className={text ? "page-delete-confirm" : "page-delete"}>
          {button || children ? (
            button ? (
              button
            ) : (
              children
            )
          ) : (
            <>
             <IconButton  sx={{
              borderRadius: "5px",
              background: "#edefec",
              width: "32px",
              height: "32px",
            }} 
            onClick={() => setOpen(true)}>
              
                <RiDeleteBin5Line size={15} color="#696969" />
               
             </IconButton>
              
            </>
          )}
        </div>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title ? title : "Confirm to submit"}
        </DialogTitle>
        <DialogContent>
          {htmlBody ? (
            htmlBody
          ) : (
            <DialogContentText id="alert-dialog-description">
              {body ? body : "Are you sure! Do you want to delete this item?"}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              confirmation(false);
              setOpen(false);
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={!canSave}
            onClick={() => {
              confirmation(true);
              setOpen(false);
            }}
            autoFocus
          >
            {successBtnText ? successBtnText : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ConfirmationDialog;
