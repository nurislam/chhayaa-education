import Link from "next/link";
import { Button } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";

export default function ViewModeButton({ mode, active }: { mode: "grid" | "list"; active: boolean }) { 
  
  return (
    <Link href={`?view=${mode}`} passHref>
      <Button variant={active ? "contained" : "outlined"} sx={{ ml: mode === "grid" ? 1 : 0 }}>
        {mode === "list" ? <ViewListIcon /> : <GridViewIcon />}
      </Button>
    </Link>
  );
}
