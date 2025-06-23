"use client";
import { styled } from "@mui/material/styles";
import { BiEditAlt } from "react-icons/bi";
import { Delete } from "@mui/icons-material";
import moment from "moment";
import UpdatePermissionModal from "@/components/permission/updatePermissionModal";
import { TableCell, TableRow, IconButton, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { PermissionType } from "@utils/generated";
import { toast } from "react-toastify";
import { useDelete } from "@data/permissions/use-permissions.query";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#528ec9",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    border: "1px solid #d1d6da",
    padding: "0px 10px",
    textTransform: "capitalize",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface IUserPropsType {
  permission: PermissionType;
  refetch: () => void;
}

const PermissionList: React.FC<IUserPropsType> = ({ permission, refetch }) => {
  const [updateModel, setUpdateModal] = useState<number | null>(null);

  const { mutate: permissionDelete } = useDelete();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this Permission?")) {
      permissionDelete(id, {
        onSuccess: () => {
          refetch();
          toast.success(`The Permission has been deleted successfully`);
        },
        onError: () => {
          toast.error(`Not possible to delete this Permission`);
        },
      });
    }
  };
  return (
    <StyledTableRow>
      <StyledTableCell>{permission.group.name}</StyledTableCell>
      <StyledTableCell>{permission.module.name}</StyledTableCell>
      <StyledTableCell align="center">
        <div>
          <label>
            <input type="checkbox" checked={permission.actions.split(",").includes("add")} disabled />
            Add
          </label>
          <label>
            <input type="checkbox" checked={permission.actions.split(",").includes("view")} disabled />
            View
          </label>
          <label>
            <input type="checkbox" checked={permission.actions.split(",").includes("edit")} disabled />
            Edit
          </label>
          <label>
            <input type="checkbox" checked={permission.actions.split(",").includes("delete")} disabled />
            Delete
          </label>
        </div>
      </StyledTableCell>
      <StyledTableCell align="center">{moment(`${permission.createdAt}`).format("MMM DD, YYYY LT")}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton
          sx={{
            borderRadius: "5px",
            background: "#edefec",
            width: "32px",
            height: "32px",
          }}
          onClick={() => setUpdateModal(permission.id ?? null)}
        >
          <BiEditAlt size={15} color="#696969" />
        </IconButton>

        <UpdatePermissionModal
          open={updateModel !== null}
          handleClose={() => setUpdateModal(null)}
          refetch={refetch}
          permission={permission}
        />

        <IconButton color="error" onClick={() => permission.id !== undefined && handleDelete(permission.id)}>
          <Delete />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default PermissionList;
