import React from "react";
import styled from "@emotion/styled";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { Typography, Stack } from "@mui/material"; 

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))`
  width: 42px;
  height: 26px;
  padding: 0;
  & .MuiSwitch-switchBase {
    padding: 0;
    margin: 2px;
    transition-duration: 300ms;
    &.Mui-checked {
      transform: translateX(16px);
      color: #fff;
      & + .MuiSwitch-track {
        background-color: #2eca45;
        opacity: 1;
        border: 0;
      }
      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.5;
      }
    }
    &.Mui-focusVisible .MuiSwitch-thumb {
      color: #33cf4d;
      border: 6px solid #fff;
    }
    &.Mui-disabled .MuiSwitch-thumb {
      color: #dedede;
    }
    &.Mui-disabled + .MuiSwitch-track {
      opacity: 0.7;
    }
  }
  & .MuiSwitch-thumb {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
  }
  & .MuiSwitch-track {
    border-radius: 13px;
    background-color: #cecece;
    opacity: 1;
  }
`;

interface IProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelOn?: string;
  labelOff?: string;
}

const ToggleSwitch: React.FC<IProps> = ({ checked, onChange, labelOn = "Active", labelOff = "Inactive" }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{ color: "#000", fontWeight: "400", fontSize: "15px" }}>Sort By:</Typography>
      <IOSSwitch checked={checked} onChange={onChange} />
      <Typography sx={{ color: "#899499", fontWeight: "400" }}>{checked ? labelOn : labelOff}</Typography>
    </Stack>
  );
};

export default ToggleSwitch;
