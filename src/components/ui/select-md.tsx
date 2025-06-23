import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SelectOption } from "@utils/generated";
import { SxProps, Typography } from "@mui/material";

interface ISelect {
  options: { name: string; value: string }[];
  color: string;
  selectedOption: string;
  setSelect: (e: string) => void;
  size?: string;
  error?: any;
  multiple?: boolean;
  placeholder?: string;
  sx?: SxProps;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

const SelectMd: React.FC<ISelect> = ({
  options,
  color,
  selectedOption,
  setSelect,
  size,
  error,
  multiple,
  placeholder,
  sx,
  open,
  onClose,
  onOpen,
}) => {
  return (
    <Select
      displayEmpty
      multiple={multiple ? multiple : false}
      error={error && error.source}
      labelId="demo-simple-select-label"
      sx={{
        m: 1,
        width: "100%",
        margin: "0px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        borderColor: "#86937F",
        padding: "4px",
        bgcolor: color,
        "& .MuiInputBase-input": { padding: size ? size : "6px 15px" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--primary)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--primary) !important",
        },
        ...sx,
      }}
      value={selectedOption}
      onChange={(event: SelectChangeEvent) => {
        setSelect(event.target.value as string);
      }}
      className="select-md"
      MenuProps={MenuProps}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      {placeholder && (
        <MenuItem disabled value="">
          <Typography variant="body1" align="left" color="textSecondary">
            {placeholder}
          </Typography>
        </MenuItem>
      )}

      {options.length > 0 &&
        options.map((src: SelectOption, index: number) => (
          <MenuItem key={index} value={src.value}>
            {src.name}
          </MenuItem>
        ))}
    </Select>
  );
};
export default SelectMd;
