import React, { useState } from "react";
import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { BiEditAlt } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const IconWithButton = styled(IconButton)`
  padding: 2px;
`;
const InputField = styled.input`
  padding: 4px 8px;
  border: #ccc solid 1px;
  border-radius: 5px;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14px;
  width: 60%;
  height: 32px;

  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 400;
  color: #717171;
  white-space: nowrap;
`;

const StyledStrong = styled.strong`
  font-size: 14px;
  font-weight: 600;
  color: rgb(0, 0, 0);
`;

interface IProps {
  setCurrentMenu: (val: any) => void;
  label?: string | null;
  field: string;
  value: string | number;
  onChange: (val: any) => void;
  saveData: (fild: any, val: any) => void;
}

const EditableField: React.FC<IProps> = ({ setCurrentMenu, label, value, field, onChange, saveData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleChange = (e: any) => {
    setTempValue(e.target.value);
    onChange(e.target.value);
  };

  const handleEditClick = (menuName: any) => {
    setCurrentMenu(menuName);
    setIsEditing(true);
    setTempValue(value);
  };

  const handleEditClosed = () => {
    setCurrentMenu("");
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <>
          <StyledLabel>{label}: </StyledLabel>
          <InputField type="text" value={tempValue} onChange={handleChange} />
          <div>
            <IconWithButton
              onClick={() => {
                saveData(field, tempValue);
                handleEditClosed();
              }}
            >
              <FaCheckCircle size={18} color="#26BF00" />
            </IconWithButton>
            <IconWithButton onClick={() => handleEditClosed()}>
              <IoCloseCircleSharp size={22} color="#FF0004" />
            </IconWithButton>
          </div>
        </>
      ) : (
        <>
          <StyledLabel>{label}: </StyledLabel>
          <p onClick={() => handleEditClick(field)}>
            {" "}
            <StyledStrong>{value}</StyledStrong>
            <IconWithButton>
              <BiEditAlt size={18} color="#696969" />
            </IconWithButton>
          </p>
        </>
      )}
    </>
  );
};

export default EditableField;
