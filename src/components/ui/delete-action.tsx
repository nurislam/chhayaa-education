import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

interface IProps {
  openDialog: boolean;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}

const DeleteAction: React.FC<IProps> = ({ openDialog, handleCancelDelete, handleConfirmDelete }) => {
  return (
    <Dialog open={openDialog} onClose={handleCancelDelete}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Are you sure! Do you want to delete this item?</DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={handleCancelDelete}
          variant="contained"
          size="medium"
          sx={{
            textTransform: "none",
            borderRadius: "5px",
            color: "#000",
            bgcolor: "#EFEFEF",
            fontSize: "14px",
            fontWeight: "600px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          size="medium"
          sx={{
            textTransform: "none",
            borderRadius: "5px",
            color: "#fff",
            bgcolor: "theme.palette.primary.main",
            fontSize: "14px",
            fontWeight: "600px",
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAction;
