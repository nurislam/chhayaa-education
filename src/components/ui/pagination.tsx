import * as React from "react";
import { ChangeEvent } from "react";
import Pagination from "@mui/material/Pagination";

interface IPage {
  count: number;
  page: number;
  changeEvent: (event: ChangeEvent<unknown>, page: number) => void;
}
const PaginationRounded: React.FC<IPage> = ({ count, page, changeEvent }) => {
  return (
    <Pagination
      count={count}
      page={page}
      onChange={changeEvent}
      variant="outlined"
      shape="rounded"
      sx={{
        backgroundColor: "#fff",
        "& .Mui-selected": {
          backgroundColor: "#1976D2 !important",
          color: "#FFF",
        },
      }}
    />
  );
};
export default PaginationRounded;
