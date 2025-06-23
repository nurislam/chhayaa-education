import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface IProps {
  name: string;
  label: string;
  type?: string;
  register: any;
  error?: string;
  helperText?: string;
  autoComplete?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  disabled?: boolean;
  sx?: object;
  value?:string;
}

const OutlinedInputField: React.FC<IProps> = ({
  name,
  label,
  type = "text",
  register,
  error,
  helperText,
  showPassword = false,  
  togglePasswordVisibility,
  disabled = false,
  sx,
  value
}) => {
  const isPasswordField = type === "password";

  return (
    <TextField
      {...register(name)}
      margin="normal"
      required
      fullWidth
      label={label}
      name={name}
      type={isPasswordField && showPassword ? "text" : type}
      error={Boolean(error)}
      helperText={helperText}
      autoFocus
      disabled={disabled}
      value={value}
      sx={{
        backgroundColor: "#ffffff",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#ffffff",
          "&.Mui-focused fieldset": {
            borderColor: "#3498db",
          },
        },
        "& label.Mui-focused": {
          color: "#3498db",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3498db !important",
        },
        "&:focus-within .MuiIconButton-root .MuiSvgIcon-root": {
          color: "#3498db",
        },
        ...sx,
      }}
      InputProps={
        isPasswordField
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default OutlinedInputField;
