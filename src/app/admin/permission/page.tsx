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
import { usePermissionQuery } from "@data/permissions/use-permissions.query";
import AddPermissionModal from "@components/permission/addPermissionModal";
import { useGroupsQuery } from "@data/group/use-group.query";
import SortTable from "@components/ui/sort-table";
import { dynamicSort } from "@utils/dynamic-sort";
import { useModulesQuery } from "@/data/module/use-module.query";
import PermissionList from "@/components/permission/permissionList";
import Link from "next/link";

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

export default function PermissionPage() {
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [groupFilter, setGroupFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt DESC");

  const { data: userGroups = [] } = useGroupsQuery({ order: ["name ASC"] });
  const { data: modules = [] } = useModulesQuery({ order: ["name ASC"] });

  const {
    data: permissions = [],
    isLoading,
    refetch,
  } = usePermissionQuery({
    include: [{ relation: "group" }, { relation: "module" }],
    order: ["createdAt DESC"],
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // **Filtering Logic**
  const filteredPermissions = permissions.filter((permission: any) => {
    const groupMatch = groupFilter === "" || permission.group.name === groupFilter;
    const moduleMatch = moduleFilter === "" || permission.module.name === moduleFilter;
    permission.module.name.toLowerCase().includes(moduleFilter.toLowerCase());

    return groupMatch && moduleMatch;
  });

  dynamicSort(filteredPermissions, sortOrder);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <CreateBtnArea>
        {/* Search Filters */}
        <SearchContainer>
          {/* Group Name Dropdown */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              displayEmpty
              sx={{ textTransform: "capitalize" }}
            >
              <MenuItem value="">All Roles</MenuItem>
              {userGroups.map((group: any) => (
                <MenuItemcustom key={group.id} value={group.name}>
                  {group.name}
                </MenuItemcustom>
              ))}
            </Select>
          </FormControl>

          {/* Module Name Text Input */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              displayEmpty
              sx={{ textTransform: "capitalize" }}
            >
              <MenuItem value="">All Modules</MenuItem>
              {modules.map((module: any) => (
                <MenuItemcustom key={module.id} value={module.name}>
                  {module.name}
                </MenuItemcustom>
              ))}
            </Select>
          </FormControl>
        </SearchContainer>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Link href="/admin/modules">
            <Button variant="contained">&nbsp; Add Module</Button>
          </Link>

          <Button variant="contained" onClick={() => setOpenModal(true)}>
            &nbsp; Add Permission
          </Button>

          <AddPermissionModal open={openModal} handleClose={() => setOpenModal(false)} refetch={refetch} />
        </Box>
      </CreateBtnArea>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>
                <SortTable order={sortOrder} setOrder={setSortOrder} fieldName="module">
                  <strong>Role Name</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable order={sortOrder} setOrder={setSortOrder} fieldName="module">
                  <strong>Module Name</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Permissions</strong>
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
            {filteredPermissions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((permission: any, index: number) => (
                <PermissionList permission={permission} key={index} refetch={refetch} />
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
            count={permissions.length}
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
            count={permissions.length}
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
