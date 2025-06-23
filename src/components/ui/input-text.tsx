import * as React from "react";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { FiSearch } from "react-icons/fi";
import { SxProps } from "@mui/material";

interface IProps {
  value: number | string;
  type: string;
  setValue: (value: any) => void;
  placeholder?: string;
  width?: string;
  icon?: boolean;
  sx?: SxProps;
}

const InputText: React.FC<IProps> = ({
  value,
  type,
  setValue,
  placeholder = "", 
  icon = true,
  sx = {},
}) => {
  return (
    <FormControl variant="standard">
      <Paper
        component="form"
        sx={{
          p: "6px 8px;",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          width: "auto",
          borderRadius: "5px",

          ...sx,
        }}
      >
        {icon && (
          <IconButton
            sx={{ p: "4px 5px", color: "#868686", fontWeight: "600" }}
            aria-label="menu"
          >
            <FiSearch size={16} />
          </IconButton>
        )}
        <InputBase
          sx={{
            ml: 0.7,
            flex: 1,
            fontSize: "14px",
            color: "#868686",
            fontWeight: "500",
            "input::placeholder": { color: "#868686", opacity: 1 },
            ".MuiInputBase-input": { padding: "2px 0px" },
          }}
          value={value}
          type={type}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
          }}
          placeholder={placeholder}
        />
      </Paper>
    </FormControl>
  );
};
export default InputText;
