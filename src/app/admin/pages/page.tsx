"use client";
import { useState } from "react";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { BiEditAlt, BiPlusMedical } from "react-icons/bi";
import Link from "next/link";
import {
  usePagesQuery,
  useDeletePagesMutation,
  useUpdatePagesMutation,
} from "@/data/pages/use-pages.query";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import Image from "next/image";
import defaultMedia from "@public/default-media.png";
import SortTable from "@/components/ui/sort-table";
import { dynamicSort } from "@/utils/dynamic-sort";

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
}));

export default function PageContent() {
  const [sortOrder, setSortOrder] = useState("createdAt DESC");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedPages, setSelectedPages] = useState<number[]>([]); // Store selected page IDs

  const [openBulkDeleteAlert, setOpenBulkDeleteAlert] = useState(false); // State for bulk delete confirmation
  const [openBulkStatusAlert, setOpenBulkStatusAlert] = useState(false); // State for bulk status confirmation

  // Fetch Pages with optional status filter
  const {
    data: Pages = [],
    refetch: refetchPages,
    isPending,
  } = usePagesQuery({
    order: ["title DESC"],
  });

  // Delete Page Mutation
  const { mutate: deletePage } = useDeletePagesMutation();
  const { mutate: updatePageStatus } = useUpdatePagesMutation();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePage(id, {
        onSuccess: () => {
          toast.success(`The post has been deleted successfully`);
          refetchPages();
        },
        onError: () => {
          toast.error(`Not possible to delete this post`);
        },
      });
    }
  };

  const handleSelectAllPages = () => {
    if (selectedPages.length === Pages.length) {
      setSelectedPages([]); // Deselect all pages if all are selected
    } else {
      setSelectedPages(Pages.map((page: any) => page.id)); // Select all pages
    }
  };

  const handleSelectPage = (id: number) => {
    setSelectedPages(
      (prevSelectedPages) =>
        prevSelectedPages.includes(id)
          ? prevSelectedPages.filter((pageId) => pageId !== id) // Deselect if already selected
          : [...prevSelectedPages, id] // Select if not already selected
    );
  };

  const handleBulkDelete = () => {
    if (selectedPages.length > 0) {
      setOpenBulkDeleteAlert(true); // Open the confirmation dialog for bulk delete
    }
  };

  const confirmBulkDelete = () => {
    selectedPages.forEach((pageId) => {
      deletePage(pageId, {
        onSuccess: () => {
          toast.success(`Pages have been deleted successfully`);
          setOpenBulkDeleteAlert(false);
          setSelectedPages([]); // Reset selected pages after deletion
          refetchPages();
        },
        onError: () => {
          toast.error(`Unable to delete the pages`);
        },
      });
    });
  };

  const handleBulkStatusUpdate = (status: any) => {
    if (selectedPages.length > 0) {
      setOpenBulkStatusAlert(true); // Open the confirmation dialog for status update
    }

    // Convert the status string to the corresponding number
    if (status === "pending") {
      status = 1;
    } else if (status === "published") {
      status = 2;
    } else if (status === "draft") {
      status = 3;
    }

    // Update selected pages' status
    selectedPages.forEach((pageId) => {
      updatePageStatus(
        { id: pageId, status }, // Pass the object as expected by the updated mutation
        {
          onSuccess: () => {
            toast.success(`Pages have been updated to ${status}`);
            setOpenBulkStatusAlert(false);
            setSelectedPages([]); // Reset selected pages after update
            refetchPages();
          },
          onError: () => {
            toast.error(`Unable to update the pages' status`);
          },
        }
      );
    });
  };

  const filteredPages = Pages.filter((page: any) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );
  dynamicSort(filteredPages, sortOrder);

  interface RemoveHtmlTagsFunction {
    (str: string): string;
  }

  const removeHtmlTags: RemoveHtmlTagsFunction = (str) => {
    // Create a new DOMParser instance to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    // Remove all <style> tags (CSS)
    const styleElements = doc.querySelectorAll("style");
    styleElements.forEach((style) => style.remove());

    // Return only the text content, which is free from HTML and CSS
    return doc.body.textContent || "";
  };
  return (
    <Box>
      {/* Top Controls: Search (Left) & Buttons (Right) */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Box>
          <Link href="/admin/pages/create" passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BiPlusMedical size={14} />}
            >
              Create New Page
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Page Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>
                <input
                  type="checkbox"
                  checked={selectedPages.length === Pages.length} // If all are selected, check this box
                  onChange={handleSelectAllPages} // Select/Deselect all pages
                />
              </StyledTableCell>
              <StyledTableCell>
                <strong>Image</strong>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="title" 
                >
                  <strong>Title</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <strong>Identifier</strong>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Content</strong>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Created by</strong>
              </StyledTableCell>

              <StyledTableCell align="center">
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="status"
                  justifyContent="center"
                >
                  <strong>Status</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="createdAt"
                  justifyContent="center"
                >
                  <strong>Created</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
              <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="updatedAt"
                  justifyContent="center"
                >
                <strong>Updated</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <strong>Action</strong>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredPages.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={10} align="center">
                  <Typography variant="body2" color="textSecondary" p={5}>
                    {isPending ? (
                      <span>Loading...</span>
                    ) : (
                      <span>No posts found</span>
                    )}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredPages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pg: any) => (
                  <StyledTableRow key={pg.id}>
                    <StyledTableCell>
                      <input
                        type="checkbox"
                        checked={selectedPages.includes(pg.id)} // Check if the page is selected
                        onChange={() => handleSelectPage(pg.id)} // Select/Deselect this page
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {pg.imageUrl ? (
                        <Image
                          src={pg.imageUrl}
                          alt={pg.categoryName}
                          width={40}
                          height={40}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      ) : (
                        <Image
                          src={defaultMedia}
                          alt="Default"
                          width={40}
                          height={40}
                          style={{
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #d1d6da",
                          }}
                        />
                      )}
                    </StyledTableCell>

                    <StyledTableCell>{pg.title}</StyledTableCell>
                    <StyledTableCell>
                      <Link
                        target="_blank"
                        href={`/${pg.identifier}`}
                        passHref
                        style={{ fontSize: "14px" }}
                      >
                        /{pg.identifier}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                      {removeHtmlTags(pg.content).length > 40
                        ? removeHtmlTags(pg.content).slice(0, 40) + "..."
                        : removeHtmlTags(pg.content)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {pg.createdBy}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {pg.status === 1 ? (
                        <span
                          style={{
                            background: "#fff3cd",
                            color: "#856404",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Pending
                        </span>
                      ) : pg.status === 2 ? (
                        <span
                          style={{
                            background: "#d4edda",
                            color: "#155724",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Published
                        </span>
                      ) : pg.status === 3 ? (
                        <span
                          style={{
                            background: "#f8d7da",
                            color: "#721c24",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          Draft
                        </span>
                      ) : null}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(pg.createdAt).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(pg.updatedAt).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Link href={`/admin/pages/edit/${pg.id}`} passHref>
                        <IconButton
                          sx={{
                            borderRadius: "5px",
                            background: "#edefec",
                            width: "32px",
                            height: "32px",
                          }}
                        >
                          <BiEditAlt size={15} color="#696969" />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(pg.id)} // Trigger the delete confirmation
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Box>
          <Button
            variant="outlined"
            onClick={() => handleBulkStatusUpdate("pending")}
            disabled={selectedPages.length === 0} // Disable if no pages are selected
          >
            Pending
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleBulkStatusUpdate("published")}
            style={{ marginLeft: "10px" }}
            disabled={selectedPages.length === 0} // Disable if no pages are selected
          >
            Published
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleBulkStatusUpdate("draft")}
            style={{ marginLeft: "10px" }}
            disabled={selectedPages.length === 0} // Disable if no pages are selected
          >
            Draft
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDelete}
            style={{ marginLeft: "10px" }}
            disabled={selectedPages.length === 0} // Disable if no pages are selected
          >
            Delete
          </Button>
          <Button variant="text" color="secondary">
            Total Records : {filteredPages.length}
          </Button>
        </Box>

        {/* Custom Pagination */}
        <Box display="flex" justifyContent="center" gap={1}>
          {/* Rows per page */}
          <TextField
            select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            SelectProps={{ native: true }}
            size="small"
            InputProps={{ style: { fontSize: "12px" } }}
            variant="outlined"
          >
            {[15, 25, 30, 45].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>

          <Button
            onClick={() => setPage(0)}
            disabled={page === 0}
            size="medium"
            variant={page === 0 ? "contained" : "outlined"}
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleDoubleLeft size={16} />
          </Button>
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            size="small"
            variant={page === 0 ? "contained" : "outlined"}
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleLeft size={16} />
          </Button>

          {Array.from({
            length: Math.ceil(filteredPages.length / rowsPerPage),
          }).map((_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i)}
              variant={i === page ? "contained" : "outlined"}
              size="small"
              style={{ minWidth: "32px", margin: "0" }}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            onClick={() =>
              setPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredPages.length / rowsPerPage) - 1
                )
              )
            }
            disabled={page >= Math.ceil(filteredPages.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredPages.length / rowsPerPage) - 1
                ? "contained"
                : "outlined"
            }
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleRight size={16} />
          </Button>
          <Button
            onClick={() =>
              setPage(Math.ceil(filteredPages.length / rowsPerPage) - 1)
            }
            disabled={page >= Math.ceil(filteredPages.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredPages.length / rowsPerPage) - 1
                ? "contained"
                : "outlined"
            }
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleDoubleRight size={16} />
          </Button>
        </Box>
      </Box>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={openBulkDeleteAlert}
        onClose={() => setOpenBulkDeleteAlert(false)}
        aria-labelledby="bulk-delete-dialog-title"
        aria-describedby="bulk-delete-dialog-description"
      >
        <DialogTitle id="bulk-delete-dialog-title">
          {"Confirm Bulk Deletion"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete the selected pages? This action cannot
          be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDeleteAlert(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmBulkDelete} color="secondary" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Status Update Confirmation Dialog */}
      <Dialog
        open={openBulkStatusAlert}
        onClose={() => setOpenBulkStatusAlert(false)}
        aria-labelledby="bulk-status-dialog-title"
        aria-describedby="bulk-status-dialog-description"
      >
        <DialogTitle id="bulk-status-dialog-title">
          {"Confirm Bulk Status Update"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to change the status of the selected pages? This
          action will update the status of all selected pages.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkStatusAlert(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => setOpenBulkStatusAlert(false)}
            color="secondary"
            autoFocus
          >
            Confirm Status Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
