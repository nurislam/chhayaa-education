"use client";

import { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { useUpdatePermissionInfo } from "@data/permissions/use-permissions.query";
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

interface UpdateModuleModalProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
  permission: any; // ID of the module to edit
}

const actionsOption = ["add", "view", "edit", "delete"];

export default function UpdatePermissionModal({ open, handleClose, refetch, permission }: UpdateModuleModalProps) {
  const [moduleId, setModuleId] = useState("");
  const [selectedActions, setSelectedActions] = useState<Record<string, boolean>>({});
  const [groupId, setGroupId] = useState("");
  const [errors, setErrors] = useState<{
    moduleId?: string;
    selectedActions?: string;
    groupId?: number;
  }>({});

  const { data: groups = [] } = useGroupsQuery({ order: ["name ASC"] });
  const { data: modules = [] } = useModulesQuery({ order: ["name ASC"] });

  const { mutate: updatePermission, isPending } = useUpdatePermissionInfo();

  useEffect(() => {
    if (permission) {
      setModuleId(permission.moduleId);
      setGroupId(permission.groupId);

      const actionsArray = permission.actions?.split(",") || [];
      const actionMap = actionsOption.reduce(
        (acc, action) => ({ ...acc, [action]: actionsArray.includes(action) }),
        {}
      );
      setSelectedActions(actionMap);
    }
  }, [permission]);

  const handleActionChange = (action: string) => {
    setSelectedActions((prev) => ({ ...prev, [action]: !prev[action] }));
  };

  const validate = () => {
    const newErrors: {
      moduleId?: string;
      selectedActions?: string;
      groupId?: number | any;
    } = {};
    if (!module) newErrors.moduleId = "Module is required";
    if (!groupId || isNaN(Number(groupId))) newErrors.groupId = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    updatePermission(
      {
        id: permission.id,
        moduleId,
        actions: Object.keys(selectedActions)
          .filter((action) => selectedActions[action])
          .join(","),
        groupId: Number(groupId),
      },
      {
        onSuccess: () => {
          toast.success("Module updated successfully!");
          handleClose();
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update module: " + (error?.message || ""));
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Update Module
        </Typography>

        {/* Role Selection */}
        <TextField
          select
          fullWidth
          label="User Role"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          margin="normal"
          error={!!errors.groupId}
          helperText={errors.groupId}
        >
          {groups.map((group: any) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Module Name */}
        <TextField
          select
          fullWidth
          label="Mudole Name"
          value={moduleId}
          onChange={(e) => setModuleId(e.target.value)}
          margin="normal"
          error={!!errors.moduleId}
          helperText={errors.moduleId}
        >
          {modules.map((module: any) => (
            <MenuItem key={module.id} value={module.id}>
              {module.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Actions */}
        <Typography mt={2}>Permissions:</Typography>
        {actionsOption.map((action) => (
          <FormControlLabel
            key={action}
            control={
              <Checkbox checked={selectedActions[action] || false} onChange={() => handleActionChange(action)} />
            }
            label={action.charAt(0).toUpperCase() + action.slice(1)}
          />
        ))}
        {errors.selectedActions && <Typography color="error">{errors.selectedActions}</Typography>}

        {/* Buttons */}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isPending}>
            {isPending ? "Updating..." : "Update Module"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
