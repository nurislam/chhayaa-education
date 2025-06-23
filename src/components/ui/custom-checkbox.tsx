import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";

const CustomCheckbox: React.FC<{
  onChange: (val: boolean) => void;
  value: boolean;
  label?: string;
  disabled?: boolean;
}> = ({ onChange, value, label, disabled = false }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          size="small"
          sx={{
            display: `${disabled && "none"}`,
            color: `var(--primary)`,

            "&.Mui-checked": {
              color: `var(--primaryHover)`,
            },
          }}
        />
      }
      label={
        <Typography variant="body1" align="center" color="textSecondary">
          {label}
        </Typography>
      }
    />
  );
};
export default CustomCheckbox;
