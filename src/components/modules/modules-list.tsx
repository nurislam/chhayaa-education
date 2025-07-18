"use client";
import { styled } from "@mui/material/styles";
import { BiEditAlt } from "react-icons/bi";
import { Delete } from "@mui/icons-material";
import moment from "moment";
import { TableCell, TableRow, IconButton, tableCellClasses } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDeleteModulesMutation } from "@data/module/use-module.query";
import UpdateModuleModal from "./update-module-modal";
import DynamicIcon from "../ui/dynamic-icon";

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
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Module {
  id: number;
  slug: string;
  name: string;
  icon: string;
  parentId: number;
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  ordering: number;
  status: number;
}

interface IModulePropsType {
  module: Module;
  refetch: () => void;
}

const ModulesList: React.FC<IModulePropsType> = ({ module, refetch }) => {
  const [updateModel, setUpdateModal] = useState<number | null>(null);
  const { mutate: deleteModule } = useDeleteModulesMutation();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this Module?")) {
      deleteModule(id, {
        onSuccess: () => {
          refetch();
          toast.success(`The module has been deleted successfully`);
        },
        onError: () => {
          toast.error(`Failed to delete the module`);
        },
      });
    }
  };

  return (
    <StyledTableRow>
      <StyledTableCell>{module.name}</StyledTableCell>
      <StyledTableCell>{module.slug}</StyledTableCell>
      <StyledTableCell align="center">
        <DynamicIcon iconName={module.icon} />
      </StyledTableCell>
      <StyledTableCell align="center">{moment(module.createdAt).format("MMM DD, YYYY LT")}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton
          sx={{
            borderRadius: "5px",
            background: "#edefec",
            width: "32px",
            height: "32px",
          }}
          onClick={() => setUpdateModal(module.id ?? null)}
        >
          <BiEditAlt size={15} color="#696969" />
        </IconButton>

        <UpdateModuleModal
          open={updateModel !== null}
          handleClose={() => setUpdateModal(null)}
          refetch={refetch}
          module={module}
        />

        <IconButton color="error" onClick={() => module.id !== undefined && handleDelete(module.id)}>
          <Delete />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ModulesList;
