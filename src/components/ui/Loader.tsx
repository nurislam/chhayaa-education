import * as React from "react";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";

const ProgressArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 65px);
`;

export const FullPageLoader = styled.div`
  position: fixed;
  z-index: 9999;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: rgba(255, 255, 255, 0.8);
  left: 0;
  & > div {
    height: 50vh;
  }
`;

export const PageLoader = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: rgba(255, 255, 255, 0.8);
  left: 0;
  & > div {
    height: 50vh;
  }
`;

export const LoaderArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 99999;
`;

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative", zIndex: "999" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={80}
        thickness={2}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#6cd480" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={80}
        thickness={2}
        {...props}
      />
    </Box>
  );
}

export default function Loader() {
  return (
    <ProgressArea className="page-loader">
      <FacebookCircularProgress />
    </ProgressArea>
  );
}
