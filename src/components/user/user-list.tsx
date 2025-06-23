import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import { IconButton, TableCell, tableCellClasses, Box } from "@mui/material";
import ConfirmationDialog from "@components/ui/confirmation-dialog";
import { UsersType } from "@utils/generated";
import UpdateUserModal from "@components/user/update-user";
import { BiEditAlt } from "react-icons/bi";
import { deleteUser } from "@/state/users";
import moment from "moment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#528ec9",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
    border: "1px solid #d1d6da",
    padding: "5px 10px",
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
interface IUserPropsType {
  item: UsersType;
  refetch: () => void;
  loginCredentials?: any;
}

const UserList: React.FC<IUserPropsType> = ({ item, refetch }) => {
  const [openUserModal, setOpenUserModal] = useState(false);
  //const router = useRouter();
  // const { mutate } = useLoginAsAnotherUserMutation(item.email || "");
  // const loginAsAnotherUser = () => {
  //   mutate(
  //     {
  //       ...loginCredentials,
  //       credentials: {
  //         username: item.email as string,
  //       },
  //     },
  //     {
  //       onSuccess: () => {
  //         const previousCookie = Cookie.get(AUTH_CRED);
  //         Cookie.set(PRE_AUTH_CRED, previousCookie ?? "", { expires: 3 });
  //         router.push(ROUTES.DASHBOARD);
  //         toast.success(`Login successful`);
  //       },
  //       onError(error: any) {
  //         if (error.response && error.response.data) {
  //           toast.error(error.response.data?.error?.message);
  //         } else {
  //           toast.error(error.toString());
  //           throw error;
  //         }
  //       },
  //     }
  //   );
  // };

  return (
    <StyledTableRow sx={{ position: "relative" }}>
      <StyledTableCell sx={{ textAlign: "left" }}>{item.email}</StyledTableCell>

      <StyledTableCell sx={{ textAlign: "left" }}>
        {item.firstName}
      </StyledTableCell>
      <StyledTableCell sx={{ textAlign: "left" }}>
        {item.lastName}
      </StyledTableCell>
      <StyledTableCell
        sx={{ textAlign: "center", textTransform: "capitalize" }}
      >
        {item.role}
      </StyledTableCell>
      <StyledTableCell sx={{ textAlign: "center" }}>
        {moment(`${item.createdAt}`).format("MMM DD, YYYY LT")}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ textTransform: "capitalize" }}>
        {item.status && item.status === "active" ? (
          <span
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {item.status}
          </span>
        ) : (
          <span
            style={{
              background: "#f8d7da",
              color: "#721c24",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {item.status}
          </span>
        )}
      </StyledTableCell>
      <StyledTableCell>
        <Box
          sx={{
            display: "flex",
            gap: "6px",
            textAlign: "center",
            placeContent: "center",
          }}
        >
          <IconButton
            sx={{
              borderRadius: "5px",
              background: "#edefec",
              width: "32px",
              height: "32px",
            }}
            onClick={() => setOpenUserModal(true)}
          >
            <BiEditAlt size={15} color="#696969" />
          </IconButton>

          <ConfirmationDialog
            confirmation={async (status: boolean) => {
              if (status) {
                await deleteUser(item.id);
                refetch();
              }
            }}
            canSave={true}
          />

          {openUserModal && (
            <UpdateUserModal
              open={openUserModal}
              setOpen={setOpenUserModal}
              refetch={refetch}
              user={item}
            />
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default UserList;
