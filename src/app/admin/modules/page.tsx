"use client";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
  TablePagination,
  tableCellClasses,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import SortTable from "@components/ui/sort-table";
import { dynamicSort } from "@utils/dynamic-sort";
import { useModulesQuery } from "@/data/module/use-module.query";
import AddModuleModal from "@/components/modules/add-module-modal";
import ModulesList from "@/components/modules/modules-list";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#528ec9",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    border: "1px solid #d1d6da",
    padding: "0px 10px",
    textTransform: "capitalize",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CreateBtnArea = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
`;

const SearchContainer = styled(Box)`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;
const MenuItemcustom = styled(MenuItem)`
  text-transform: capitalize;
`;

interface Module {
  id: number;
  slug: string;
  name: string;
  icon: string;
  parentId: number;
  createdAt: string;
  createdBy: string;
  deleted: boolean;
  ordering: number;
  status: number;
}

export default function ModulesPage() {
  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [moduleFilter, setModuleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("ordering ASC");

  const { data: modules = [], isLoading, refetch } = useModulesQuery({ order: ["ordering ASC"] });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredModules = modules.filter((module: Module) =>
    module.name.toLowerCase().includes(moduleFilter.toLowerCase())
  );
  dynamicSort(filteredModules, sortOrder);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <CreateBtnArea>
        {/* Search Filters */}
        <SearchContainer>
          {/* Module Name Text Input */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              displayEmpty
              sx={{ textTransform: "capitalize" }}
            >
              <MenuItem value="">All Modules</MenuItem>
              {modules.map((module: Module) => (
                <MenuItemcustom key={module.id} value={module.name}>
                  {module.name}
                </MenuItemcustom>
              ))}
            </Select>
          </FormControl>
        </SearchContainer>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" onClick={() => setOpenModuleModal(true)}>
            &nbsp; Add Module
          </Button>
          <AddModuleModal open={openModuleModal} handleClose={() => setOpenModuleModal(false)} refetch={refetch} />
        </Box>
      </CreateBtnArea>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>
                <SortTable order={sortOrder} setOrder={setSortOrder} fieldName="name">
                  <strong>Module Name</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable order={sortOrder} setOrder={setSortOrder} fieldName="slug">
                  <strong>Slug</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Icon</strong>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable order={sortOrder} setOrder={setSortOrder} fieldName="createdAt" justifyContent="center">
                  <strong>Created</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Actions</strong>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredModules
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((module: Module, index: number) => (
                <ModulesList key={index} module={module} refetch={refetch} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Container: Left for "Rows per page", Right for page controls */}
      <PaginationContainer>
        {/* Left Side: Rows per page */}
        <Box display="flex" alignItems="center">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredModules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              border: "none",
              "& .MuiTablePagination-toolbar": {
                paddingLeft: "0px",
              },
              "& .MuiTablePagination-spacer": { display: "none" },
              "& .MuiInputBase-root": { marginRight: "20px" },
              "& .MuiTablePagination-selectLabel": { display: "block" },
              "& .MuiTablePagination-actions": {
                display: "none", // Hide the arrow icons (both previous and next)
              },
            }}
            // Hide the label that displays row count (1–1 of 1)
            labelDisplayedRows={() => null}
            // Hide the first and last page buttons (arrows)
            showFirstButton={false}
            showLastButton={false}
          />
        </Box>

        {/* Right Side: Hide the arrows (left and right pagination arrows) */}
        <Box>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={filteredModules.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            sx={{
              border: "none",
              "& .MuiTablePagination-toolbar": {
                paddingLeft: "0px",
              },
              "& .MuiTablePagination-spacer": { display: "none" },
              "& .MuiInputBase-root": { marginRight: "20px" },
              "& .MuiTablePagination-selectLabel": { display: "block" },
            }}
          />
        </Box>
      </PaginationContainer>
    </Box>
  );
}
