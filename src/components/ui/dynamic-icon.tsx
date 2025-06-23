import { ComponentType, SVGProps } from "react";

import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as CiIcons from "react-icons/ci";
import * as DiIcons from "react-icons/di";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FcIcons from "react-icons/fc";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LiaIcons from "react-icons/lia";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import * as RxIcons from "react-icons/rx";
import * as SiIcons from "react-icons/si";
import * as SlIcons from "react-icons/sl";
import * as TbIcons from "react-icons/tb";
import * as TfiIcons from "react-icons/tfi";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";

const iconSets = {
  ...AiIcons,
  ...BiIcons,
  ...BsIcons,
  ...CgIcons,
  ...CiIcons,
  ...DiIcons,
  ...FaIcons,
  ...Fa6Icons,
  ...FcIcons,
  ...FiIcons,
  ...GiIcons,
  ...GoIcons,
  ...GrIcons,
  ...HiIcons,
  ...Hi2Icons,
  ...ImIcons,
  ...IoIcons,
  ...Io5Icons,
  ...LiaIcons,
  ...LuIcons,
  ...MdIcons,
  ...PiIcons,
  ...RiIcons,
  ...RxIcons,
  ...SiIcons,
  ...SlIcons,
  ...TbIcons,
  ...TfiIcons,
  ...TiIcons,
  ...VscIcons,
  ...WiIcons,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  className?: string;
}

type IconComponent = ComponentType<IconProps>;

interface DynamicIconProps {
  iconName: string;
  size?: number | string;
  color?: string;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, size, color, className }) => {
  const IconComponent = iconSets[iconName as keyof typeof iconSets] as IconComponent | undefined;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} className={className} />;
};

export default DynamicIcon;
