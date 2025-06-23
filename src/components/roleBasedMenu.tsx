import { BsFillPostcardFill } from "react-icons/bs";  
import DashboardIcon from "@mui/icons-material/Dashboard";  
import { FaUserGroup } from "react-icons/fa6";
import { RiPagesFill } from "react-icons/ri";
import { SiHiveBlockchain } from "react-icons/si";
import { IoMdSettings } from "react-icons/io"; 
import { MdVerifiedUser } from "react-icons/md";
import {
  adminAndOwnerOnly, 
  allowedRoles, 
  vendorOnly,
} from "@utils/auth-utils";
 
const roleBasedMenu = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardIcon />,
    permissions: allowedRoles,
  },
   
  {
    name: "Pages",
    href: "/admin/pages",
    icon: <RiPagesFill />,
    permissions: vendorOnly,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: <BsFillPostcardFill />,
    permissions: adminAndOwnerOnly,
  },
  {
    name: "Blocks",
    href: "/admin/blocks",
    icon: <SiHiveBlockchain />,
    permissions: adminAndOwnerOnly,
  },  
   
  {
    name: "Users",
    href: "/admin/users",
    icon: <FaUserGroup />,
    permissions: adminAndOwnerOnly,
  },
  {
    name: "Permission",
    href: "/admin/permission",
    icon: <MdVerifiedUser />,
    permissions: adminAndOwnerOnly,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <IoMdSettings />,
    permissions: allowedRoles,
  },
];

export default roleBasedMenu;
