"use client";

import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlogDetailsButtonProps {
  href: string;
  buttonName?: string;
}

export default function LinkButton({
  href,
  buttonName = "Details",
}: BlogDetailsButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(href);
    }, 1000); // Adjust delay if needed
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={loading}
      endIcon={loading ? <CircularProgress size={10} color="inherit" /> : null}
    >
      {loading ? "wait..." : buttonName}
    </Button>
  );
}
