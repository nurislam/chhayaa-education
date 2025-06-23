"use client";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { 
  useCreatePermissionMutation, 
} from "@data/permissions/use-permissions.query";
import { toast } from "react-toastify";
import { useGroupsQuery } from "@/data/group/use-group.query";
import { useModulesQuery } from "@/data/module/use-module.query";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const MenuItemcustom = styled(MenuItem)`
  text-transform: capitalize;
`;

interface ModuleModalProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
}

const actionsOption = ["add", "view", "edit", "delete"];

export default function AddPermissionModal({
  open,
  handleClose,
  refetch,
}: ModuleModalProps) {
  const [moduleId, setModuleId] = useState<number>();
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >({});
  const [groupId, setGroupId] = useState<number | "">("");
  const [errors, setErrors] = useState<{
    moduleId?: string;
    selectedActions?: string;
    groupId?: string;
  }>({});

  const { data: groups = [] } = useGroupsQuery({ order: ["name ASC"] });
  const { data: modules = [] } = useModulesQuery({ order: ["name ASC"] });

  const { mutate: createPermission, isPending } = useCreatePermissionMutation();

  useEffect(() => {
    if (!open) {
      setModuleId(undefined);
      setSelectedActions({});
      setErrors({});
    }
  }, [open]);

  const handleActionChange = (action: string) => {
    setSelectedActions((prev) => ({ ...prev, [action]: !prev[action] }));
  };

  const validate = () => {
    const newErrors: {
      moduleId?: string; // Change to string to hold error messages
      selectedActions?: string;
      groupId?: string; // Change to string to hold error messages
    } = {};

    if (!Object.values(selectedActions).includes(true))
      newErrors.selectedActions = "At least one action is required";

    if (!moduleId || !groupId) {
      newErrors.moduleId = "Module is required";
      newErrors.groupId = "Role is required";
    }

    // if (
    //   isModuleGroupDuplicate(moduleId ?? null, groupId !== "" ? groupId : null)
    // ) {
    //   newErrors.moduleId = "This combination of Module and Role already exists";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Example function to check for duplicate moduleId and groupId combination
  // const isModuleGroupDuplicate = (
  //   moduleId: number | null,
  //   groupId: number | null
  // ) => {
  //   // Replace this logic with your actual logic to check against existing data (e.g., query the database or state)
  //   const permissions = useCheckPermissions(moduleId ?? 0, groupId ?? 0);
  //   // Check if the combination already exists
  //   return permissions ? true : false;
  // };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    createPermission(
      {
        moduleId: moduleId as number,
        actions: Object.keys(selectedActions)
          .filter((action) => selectedActions[action])
          .join(","),
        groupId: Number(groupId),
      },
      {
        onSuccess: () => {
          toast.success("Module added successfully!");
          handleClose();
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to add module: " + (error?.message || ""));
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add Permission
        </Typography>

        <TextField
          select
          fullWidth
          label="User Role"
          value={groupId}
          onChange={(e) => setGroupId(Number(e.target.value))}
          margin="normal"
          error={!!errors.groupId}
          helperText={errors.groupId}
        >
          <MenuItem>All Modules</MenuItem>
          {groups.map((group: any) => (
            <MenuItemcustom key={group.id} value={group.id}>
              {group.name}
            </MenuItemcustom>
          ))}
        </TextField>

        {/* Role Selection */}
        <TextField
          select
          fullWidth
          label="Module Name"
          value={moduleId}
          onChange={(e) => setModuleId(Number(e.target.value))}
          margin="normal"
          error={!!errors.moduleId}
          helperText={errors.moduleId}
        >
          <MenuItem>All Modules</MenuItem>
          {modules.map((module: any) => (
            <MenuItemcustom key={module.id} value={module.id}>
              {module.name}
            </MenuItemcustom>
          ))}
        </TextField>

        {/* Actions */}
        <Typography mt={2}>Permissions:</Typography>
        {actionsOption.map((action) => (
          <FormControlLabel
            key={action}
            control={
              <Checkbox
                checked={selectedActions[action] || false}
                onChange={() => handleActionChange(action)}
              />
            }
            label={action.charAt(0).toUpperCase() + action.slice(1)}
          />
        ))}
        {errors.selectedActions && (
          <Typography color="error">{errors.selectedActions}</Typography>
        )}

        {/* Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Add Module"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
