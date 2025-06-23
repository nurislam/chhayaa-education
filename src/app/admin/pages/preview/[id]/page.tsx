"use client";

import { usePagesQuery } from "@/data/pages/use-pages.query";
import { Box, Typography, Skeleton, Paper } from "@mui/material";
import { useParams } from "next/navigation";

export default function PreviewPage() {
  const { id } = useParams();

  const { data: pageData = null, isLoading } = usePagesQuery({
    where: { id: parseInt(id as string), deleted: false },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 4,
          maxWidth: "800px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton variant="text" width="60%" height={50} sx={{ mx: "auto", mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height="70vh" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "800px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", pb: 1, mb: 3 }}>
        {pageData[0].title}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid #ddd",
          minHeight: "70vh",
          overflow: "hidden",
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: pageData[0].content }} />
      </Paper>
    </Box>
  );
}
