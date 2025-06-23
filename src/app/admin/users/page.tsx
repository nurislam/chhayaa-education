"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ToggleSwitch from "@/components/ui/toggle-switch";
import InputText from "@/components/ui/input-text";
import Pagination from "@components/ui/pagination";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { UsersType } from "@utils/generated";
import { useUsersQuery } from "@/data/user/use-user-list.query";
import { dynamicSort } from "@utils/dynamic-sort";
import SelectMd from "@components/ui/select-md";
import CreateUserModal from "@components/user/create-user";
import SortTable from "@components/ui/sort-table";
import UserList from "@/components/user/user-list"; 

const USER_TYPES = [
  { name: "Admin", value: "admin" },
  { name: "Sales Team", value: "sale" },
  { name: "Vendors", value: "vendor" },
];

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
    
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
   
  // hide last border
  // "&:last-child td, &:last-child th": {
  //   border: 0,
  // },
}));

const CreateBtnArea = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin: 0px 0 22px;
  align-items: center;
`;

const SelectArea = styled(Box)`
  min-width: 200px;
  font-family: sans-serif;
`;

const FilterArea = styled(Box)`
  display: flex;
  justify-content: space-between;
  column-gap: 20px;
`;

type FilterType = {
  userType: string;
  status: string;
  searchText: string;
  limit: number;
  page: number;
};

const User = () => {
  const [sortOrder, setSortOrder] = useState("createdAt DESC");
  const [filter, setFilter] = useState<FilterType>({
    userType: "",
    status: "",
    searchText: "",
    limit: 5,
    page: 1,
  });
  const [filterUsers, setFilterUsers] = useState<UsersType[]>([]);
  const [paginateUsers, setPaginateUsers] = useState<UsersType[]>([]);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);

  const {
    data: users,
    isPending,
    refetch,
  } = useUsersQuery({
    where: {
      deleted: 0,
    },
    order: ["createdAt DESC"],
  });

  // paginate the filtered data
  useEffect(() => {
    const paginateContent = (
      array: any,
      page_size: number,
      page_number: number
    ) => {
      return array.slice(
        (page_number - 1) * page_size,
        page_number * page_size
      );
    };
    if (filterUsers && filterUsers.length > 0) {
      setPaginateUsers(paginateContent(filterUsers, filter.limit, filter.page));
    } else {
      setPaginateUsers([]);
    }
  }, [filterUsers, filter]);

  useEffect(() => {
    if (users && users.length > 0) {
      const filteredData = users
        .filter((item: UsersType) => {
          if (filter.userType && item.role !== filter.userType) {
            return false;
          } else {
            return true;
          }
        })
        .filter((item: UsersType) => {
          if (filter.status === "active" && item.status !== "active")
            return false;
          if (filter.status === "inactive" && item.status !== "inactive")
            return false;
          return true;
        })
        .filter((item: UsersType) => {
          return (
            item.firstName
              .toLowerCase()
              .includes(filter.searchText.toLowerCase()) ||
            item.lastName
              .toLowerCase()
              .includes(filter.searchText.toLowerCase()) ||
            (item.email &&
              item.email
                .toLowerCase()
                .includes(filter.searchText.toLowerCase()))
          );
        });

      const sortedUsers = dynamicSort(filteredData, sortOrder);

      setFilterUsers(sortedUsers);
    }
  }, [filter, users, sortOrder]);

  return (
    <Box>
      {/* <BreadcrumbCustom /> */}
      {/* <Title title={"User List"} /> */}
      <CreateBtnArea>
        <FilterArea>
          <InputText
            value={filter.searchText}
            type="text"
            setValue={(value: string) =>
              setFilter({ ...filter, searchText: value, page: 1 })
            }
            placeholder="Search "
          />
          <SelectArea>
            <SelectMd
              options={USER_TYPES}
              selectedOption={filter.userType}
              color="#fff"
              setSelect={(value: string) =>
                setFilter({ ...filter, userType: value, page: 1 })
              }
              placeholder="Select User Type"
              size="5px 15px"
            />
          </SelectArea>
          <ToggleSwitch
            checked={filter.status === "active"}
            onChange={(e) =>
              setFilter({
                ...filter,
                status: e.target.checked ? "active" : "inactive",
                page: 1,
              })
            }
          />
        </FilterArea>

        <Button
          variant="contained"
          onClick={() => setOpenCreateUserModal(true)}
        >
          {/* <BiPlusMedical size={14} /> */}
          &nbsp; Create New User
        </Button>
        <CreateUserModal
          open={openCreateUserModal}
          setOpen={setOpenCreateUserModal}
          refetch={refetch}
        />
      </CreateBtnArea>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#FFF",
          marginBottom: "30px",
          paddingBottom: "30px",
          boxShadow: "none",
          overflowX: "initial",
        }}
      >
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell sx={{ cursor: "pointer" }}>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="firstName"
                >
                  First Name
                </SortTable>
              </StyledTableCell>
              <StyledTableCell sx={{ cursor: "pointer" }}>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="lastName"
                >
                  Last Name
                </SortTable>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
              <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="role"
                   justifyContent="center"
                >Role
                </SortTable>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
              <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="createdAt"
                   justifyContent="center"
                >Created
                </SortTable>
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Status
              </StyledTableCell>

              <StyledTableCell sx={{ textAlign: "center" }}>
                Action
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {isPending ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "50px 20px 0px" }}
                >
                  <div>
                    <CircularProgress /> {/* Show loading spinner */}
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {paginateUsers &&
                  paginateUsers.length > 0 &&
                  paginateUsers.map((src: UsersType, index: number) => (
                    <UserList item={src} key={index} refetch={refetch} />
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {filterUsers.length / filter.limit > 1 && (
        <div>
          <Pagination
            count={Math.ceil(filterUsers.length / filter.limit)}
            page={filter.page}
            changeEvent={(event: any, value: number) =>
              setFilter({ ...filter, page: value })
            }
          />
        </div>
      )}
    </Box>
  );
};

export default User;
