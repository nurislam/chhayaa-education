"use client";
import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function AdminBreadcrumbs() {
  const segments = useSelectedLayoutSegments();

  const path = segments.reduce(
    (acc: string[], segment: string, index: number) => {
      const prevPath = acc[index - 1] || "";
      acc.push(`${prevPath}/${segment}`);
      return acc;
    },
    []
  );

  return (
    <Breadcrumbs
      separator={<MdOutlineKeyboardDoubleArrowRight fontSize="medium" />}
      aria-label="breadcrumb"
    >
      <Link href={`/`} passHref>
        Home
      </Link>
      {segments.map((segment, index) => (
          <Typography color="text.primary" key={index}>
            <Link href={`/admin${path[index]}`} passHref>
              {decodeURIComponent(segment)}
            </Link>
            {index < segments.length - 1 }
          </Typography>
        ))}
      
    </Breadcrumbs>
    // <nav aria-label="Breadcrumb">
    //   <ul style={{ display: 'flex', listStyle: 'none', gap: '0.5rem' }}>
    //     <li>
    //       <Link href="/">Home</Link> &gt;
    //     </li>
    //     {segments.map((segment, index) => (
    //       <li key={index}>
    //         <Link href={path[index]}>
    //           {decodeURIComponent(segment)}
    //         </Link>
    //         {index < segments.length - 1 && ' > '}
    //       </li>
    //     ))}
    //   </ul>
    // </nav>
  );
}
