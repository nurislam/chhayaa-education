import { fetchPagesDetails } from "@data/pages/use-pages.query";
import { Alert, Box, Breadcrumbs, Container, Typography } from "@mui/material";
import { getserverAuth } from "@utils/api/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

// Update the type to reflect that params is now a Promise
export default async function LoopPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  // Await the params Promise to get the actual values
  const { identifier } = await params;
  const ctx = await getserverAuth();
  const pageData = await fetchPagesDetails(identifier, ctx);

  try {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          sx={{ padding: "0 0 10px", borderBottom: "dotted 1px #ccc" }}
        >
          <Breadcrumbs
            separator={<MdOutlineKeyboardDoubleArrowRight fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link href={`/`} passHref>
              Home
            </Link>
            <Typography color="text.primary">{pageData.title}</Typography>
          </Breadcrumbs>
        </Box>
        <Box className="page-content">
          {pageData.status !== 2 &&
            (ctx ? (
              <Alert variant="filled" severity="warning">
                {pageData.status === 1
                  ? "This page is currently in Pending mode and has not yet been published."
                  : "This page is currently in Draft mode and has not yet been published."}
              </Alert>
            ) : (
              notFound()
            ))}
            
          {pageData.message && notFound()}

          {pageData.content && (
            <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
          )}
        </Box>
      </Container>
    );
  } catch (error) {
    return (
      <Container
        maxWidth="lg"
        style={{ textAlign: "center", marginTop: "5%", marginBottom: "100px" }}
      >
        <Box>
          <Typography variant="h4" color="error" gutterBottom>
            This page can&apos;t be reached
          </Typography>
          <Typography variant="body1" color="error" gutterBottom>
            {error instanceof Error && `${error.message}`}
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Oops! Something went wrong on our end.
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Please try again later. If the issue persists, contact support.
          </Typography>
          <Link href="/" passHref style={{ marginTop: "20px" }}>
            Go Back to Home
          </Link>
        </Box>
      </Container>
    );
  }
}
