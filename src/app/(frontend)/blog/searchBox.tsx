"use client";

import { TextField } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <TextField
      fullWidth
      size="small"
      label="Search Post"
      variant="outlined"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handleKeyPress}
      sx={{ mt: 2, mb: 3 }}
    />
  );
}
