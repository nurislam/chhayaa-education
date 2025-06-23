import React from "react";
import styled from "@emotion/styled";
import LoadingButton from "@mui/lab/LoadingButton";

const StyledButton = styled(LoadingButton)`
  font-size: ${(props: { fontSize?: string }) => props.fontSize || "20px"};
  width: ${(props: { fullWidth?: boolean }) =>
    props.fullWidth ? "100%" : "auto"};
  border-radius: 5px;
  background-color: var(--primary);
  text-transform: capitalize;
  &:hover {
    background-color: #92af82;
  }
`;

interface IProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  variant?: "text" | "outlined" | "contained";
  children: React.ReactNode;
  fullWidth?: boolean;
  fontSize?: string;
}

const RegisterButton: React.FC<IProps> = ({
  type = "button",
  onClick,
  loading = false,
  variant = "contained",
  children,
  fullWidth = true,
  fontSize,
}) => {
  return (
    <StyledButton
      type={type} 
      onClick={onClick}
      loading={loading}
      variant={variant}
      fullWidth={fullWidth}
      fontSize={fontSize}
    >
      {children}
    </StyledButton>
  );
};

export default RegisterButton;
