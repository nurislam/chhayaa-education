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
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { BiEditAlt, BiPlusMedical } from "react-icons/bi";
import Link from "next/link";
import {
  useDeleteCours,
  useCoursesQuery,
  useUpdateCoursesById,
} from "@data/courses/use-courses.query";

import SortTable from "@components/ui/sort-table";
import { dynamicSort } from "@utils/dynamic-sort";
import { useCategoryQuery } from "@data/category/use-category.query";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import defaultMedia from "@public/default-media.png";
import Image from "next/image";

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

export default function BlogPage() {
  const [sortOrder, setSortOrder] = useState("createdAt DESC");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [postStatusFilter, setPostStatusFilter] = useState<string | null>(null);
  const [categoryIdFilter, setCategoryIdFilter] = useState<string | null>(null);
  const [openBulkStatusAlert, setOpenBulkStatusAlert] = useState(false); // State for bulk status confirmation
  const [openBulkDeleteAlert, setOpenBulkDeleteAlert] = useState(false);

  // Fetch courses
  const {
    data: posts = [],
    isPending,
    refetch: refetchPosts,
  } = useCoursesQuery({
    include: [
      {
        relation: "category",
        scope: {
          fields: { id: true, categoryName: true },
        },
      },
      {
        relation: "lessons",
        scope: {
          fields: { id: true, name: true },
        },
      },
      {
        relation: "instructor",
        scope: {
          fields: { id: true, name: true },
        },
      },
    ],
    order: ["createdAt DESC"],
  });

  // Fetch categories
  const { data: categories = [] } = useCategoryQuery({
    where: { categoryType: "course", deleted: 0 },
    order: ["createdAt DESC"],
  });

  // Delete Post Mutation
  const { mutate: deletePost } = useDeleteCours();
  const { mutate: updatePageStatus } = useUpdateCoursesById();

  // Filter courses based on title, status, and category
  const filteredPost = posts.filter((post: any) => {
    const isStatusMatch = postStatusFilter
      ? post.status === postStatusFilter
      : true;
    const isCategoryMatch = categoryIdFilter
      ? post.categoryId === parseInt(categoryIdFilter)
      : true;

    return (
      post.title.toLowerCase().includes(search.toLowerCase()) &&
      isStatusMatch &&
      isCategoryMatch
    );
  });
  console.log(filteredPost);

  dynamicSort(filteredPost, sortOrder);

  const handleSelectPost = (id: number) => {
    setSelectedPosts((prevSelectedPosts) => {
      if (prevSelectedPosts.includes(id)) {
        return prevSelectedPosts.filter((postId) => postId !== id);
      } else {
        return [...prevSelectedPosts, id];
      }
    });
  };

  const handleCategoryChange = (event: any) => {
    setCategoryIdFilter(event.target.value);
  };
  const filtterCategoryStatus = (event: any) => {
    setPostStatusFilter(event.target.value);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(id, {
        onSuccess: () => {
          toast.success(`The post has been deleted successfully`);
        },
        onError: () => {
          toast.error(`Not possible to delete this post`);
        },
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedPosts.length > 0) {
      setOpenBulkDeleteAlert(true); // Open the confirmation dialog for bulk delete
    }
  };

  const confirmBulkDelete = () => {
    selectedPosts.forEach((postId) => {
      deletePost(postId, {
        onSuccess: () => {
          toast.success(`Pages have been deleted successfully`);
          setOpenBulkDeleteAlert(false);
          setSelectedPosts([]);
          refetchPosts();
        },
        onError: () => {
          toast.error(`Unable to delete the pages`);
        },
      });
    });
  };
  const handleStatusChange = (status: any) => {
    if (selectedPosts.length > 0) {
      setOpenBulkStatusAlert(true);
    }

    selectedPosts.forEach((postId) => {
      updatePageStatus(
        { id: postId, status },
        {
          onSuccess: () => {
            toast.success(`Posts have been updated to ${status}`);
            setOpenBulkStatusAlert(false);
            setSelectedPosts([]);
            refetchPosts();
          },
          onError: () => {
            toast.error(`Unable to update the Posts status`);
          },
        }
      );
    });
  };

  return (
    <Box>
      {/* Top Controls: Search (Left) & Buttons (Right) */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Search by Title"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Category Dropdown */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryIdFilter || ""}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category: any) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={postStatusFilter || ""}
              onChange={filtterCategoryStatus}
              label="Status"
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="pending"> Pending</MenuItem>
              <MenuItem value="draft"> Draft </MenuItem>
              <MenuItem value="published"> Published</MenuItem>
              <MenuItem value="deleted"> Deleted</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Link href="/admin/courses/create" passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BiPlusMedical size={14} />}
            >
              Create New Course
            </Button>
          </Link>

          <Link
            href="/admin/courses/lessons"
            passHref
            style={{ marginLeft: "20px" }}
          >
            <Button variant="contained" color="primary">
              Lessons
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Expense Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedPosts(
                      isChecked ? posts.map((p: any) => p.id) : []
                    );
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center">Image</StyledTableCell>

              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="title"
                  justifyContent="center"
                >
                  <strong>Title</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="identifier"
                  justifyContent="center"
                >
                  <strong>Identifier</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="categoryId"
                  justifyContent="center"
                >
                  <strong>Category</strong>
                </SortTable>
              </StyledTableCell>

              <StyledTableCell>
                <strong>Content</strong>
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
              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="createdAt"
                  justifyContent="center"
                >
                  <strong>Created</strong>
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="updatedAt"
                  justifyContent="center"
                >
                  <strong>Updated</strong>
                </SortTable>
              </StyledTableCell>

              <StyledTableCell align="center" sx={{ width: "100px" }}>
                <strong>Action</strong>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredPost.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={10} align="center">
                  <Typography variant="body2" color="textSecondary" p={5}>
                    {isPending ? (
                      <span>Loading...</span>
                    ) : (
                      <span>No courses found</span>
                    )}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredPost
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((post: any) => (
                  <StyledTableRow key={post.id}>
                    <StyledTableCell>
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleSelectPost(post.id)}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          width={40}
                          height={40}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      ) : post.featured ? (
                        <img
                          src={post.featured}
                          alt={post.title}
                          width={40}
                          height={40}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      ) : (
                        <img
                          src={"/default-media.png"}
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
                    <StyledTableCell>{post.title}</StyledTableCell>
                    <StyledTableCell>
                      <Link
                        target="_blank"
                        href={`/courses/${post.identifier}`}
                        passHref
                        style={{ fontSize: "14px" }}
                      >
                        /{post.identifier}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                      {post.category?.categoryName || "-"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {post.content && post.content.length > 30
                        ? post.content.slice(0, 30) + "..."
                        : post.content}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ textAlign: "center", textTransform: "capitalize" }}
                    >
                      {post.status === "published" ? (
                        <span
                          style={{
                            background: "#d4edda",
                            color: "#155724",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          {post.status}
                        </span>
                      ) : post.status === "draft" ? (
                        <span
                          style={{
                            background: "#fff3cd",
                            color: "#856404",
                            padding: "5px 10px",
                            borderRadius: "5px",
                          }}
                        >
                          {post.status}
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
                          {post.status}
                        </span>
                      )}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: "center" }}>
                      {post.updatedAt
                        ? new Date(post.updatedAt).toLocaleDateString()
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Link
                        href={`/admin/courses/edit/${post.identifier}`}
                        passHref
                      >
                        <IconButton color="primary" size="small">
                          <BiEditAlt />
                        </IconButton>
                      </Link>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(post.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bottom Control with Status Buttons and Pagination */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => handleStatusChange("pending")}
            disabled={selectedPosts.length === 0}
          >
            Pending
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleStatusChange("published")}
            disabled={selectedPosts.length === 0}
          >
            Published
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleStatusChange("draft")}
            disabled={selectedPosts.length === 0}
          >
            Draft
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDelete}
            disabled={selectedPosts.length === 0}
          >
            Deleted
          </Button>
          <Button variant="text" color="secondary">
            Total Records : {filteredPost.length}
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
            size="small"
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
            length: Math.ceil(filteredPost.length / rowsPerPage),
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
                  Math.ceil(filteredPost.length / rowsPerPage) - 1
                )
              )
            }
            disabled={page >= Math.ceil(filteredPost.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredPost.length / rowsPerPage) - 1
                ? "contained"
                : "outlined"
            }
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleRight size={16} />
          </Button>
          <Button
            onClick={() =>
              setPage(Math.ceil(filteredPost.length / rowsPerPage) - 1)
            }
            disabled={page >= Math.ceil(filteredPost.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredPost.length / rowsPerPage) - 1
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
