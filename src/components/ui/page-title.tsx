import styled from "@emotion/styled";
import { IconButton, Typography } from "@mui/material"; 
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'; 
interface TitleProps {
  backgroundSize?: string;
}

const Title = styled.h2<TitleProps>`
  background-color: #ffffff;
  color: #000000;
  font-size: 20px;
  font-weight: 600;
  padding: 30px 0px;
  border-bottom: #dedede99 solid 1px;
  background: linear-gradient(#86937f, #86937f) left bottom no-repeat;
  background-size: ${(props) => props.backgroundSize || "5%"} 2px;
  display: flex;
  gap: 5px;
  justify-items: center;
  align-items: center;
`;

interface ITitle {
  title: string;
  backgroundSize?: string;
  icon?: boolean;
  href?: any;
}

const PageTitle: React.FC<ITitle> = ({ title, backgroundSize, icon = false, href = false }) => {
  return (
    <Title backgroundSize={backgroundSize}>
      {icon && (
        <IconButton
          sx={{
            borderRadius: "5px",
            background: "#edefec",
            width: "40px",
            height: "40px",
            lineHeight: "20px",
            marginRight: "10px",
          }}
        >
          {href ? (
            <a href={`${href}`}>
              <KeyboardReturnIcon />
            </a>
          ) : (
            <KeyboardReturnIcon />
          )}
        </IconButton>
      )}
     <Typography sx={{fontSize:"20px", fontWeight:"600", textTransform:"capitalize"}}> {title}</Typography>
    </Title>
  );
};

export default PageTitle;
