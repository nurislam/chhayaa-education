"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  IconButton,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  Paper, 
  Button, 
  Box,
  TextField,
} from "@mui/material";
import { CategoryType } from "@/types/products";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDeleteCategory } from "@data/category/use-category.query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteAction from "@components/ui/delete-action";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { BiEditAlt } from "react-icons/bi";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateCategoryModal from "./update-category";
import defaultMedia from "@public/default-media.png";
import SortTable from "@components/ui/sort-table";

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
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
    padding: "1px 10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Validation schema
const schema = Yup.object({
  categoryName: Yup.string().required("Category Name is required"),
  categoryDescription: Yup.string().required(
    "Category Description is required"
  ),
});

interface IProps {
  data: CategoryType[];
  refetch: any;
  search: any;
}

const CategoryTable: React.FC<IProps> = ({ data, search, refetch }) => {
  const [sortOrder, setSortOrder] = useState("createdAt DESC");
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(12); // Rows per page

  const { mutate: deleteCategory } = useDeleteCategory();
  const router = useRouter();

  const {
    formState: {},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category);
    reset({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
    });
    setOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id, {
        onSuccess: () => {
          toast.success("Category deleted successfully");
          refetch();
          router.refresh();
          setOpenDeleteDialog(false);
        },
      });
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectedCategories(data.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  // const handleChangePage = (newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 20));
  //   setPage(0); // Reset to the first page on rows change
  // };

  const filteredData = data.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  dynamicSort(paginatedData, sortOrder);

  // Function to get the parent category name
  const getParentCategoryName = (parentId: number | null | undefined) => {
    if (parentId === undefined || parentId === null) {
      return "None";
    }
    const parentCategory = data.find((cat) => cat.id === parentId);
    return parentCategory ? parentCategory.categoryName : "None";
  };

  const handleBulkDelete = () => {
    // Bulk delete logic
    toast.success(
      `${selectedCategories.length} categories deleted successfully`
    );
    setSelectedCategories([]);
    refetch();
  };

  const handleBulkActive = () => {
    // Bulk set categories as active
    toast.success(`${selectedCategories.length} categories set to active`);
    setSelectedCategories([]);
    refetch();
  };

  const handleBulkInactive = () => {
    // Bulk set categories as inactive
    toast.success(`${selectedCategories.length} categories set to inactive`);
    setSelectedCategories([]);
    refetch();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === data.length}
                  onChange={handleSelectAllChange}
                />
              </StyledTableCell>
              <StyledTableCell align="center">Image</StyledTableCell>
              <StyledTableCell>Parent Category</StyledTableCell>
              <StyledTableCell>
              <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="categoryName" 
                >
                  Name
                </SortTable>
              </StyledTableCell>
              <StyledTableCell>Slug</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell align="center">
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="status"
                  justifyContent="center"
                >
                  Status
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="createdAt"
                  justifyContent="center"
                >
                  Created
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">
                <SortTable
                  order={sortOrder}
                  setOrder={setSortOrder}
                  fieldName="status"
                  justifyContent="center"
                >
                  UpdateAt
                </SortTable>
              </StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((category) => (
              <StyledTableRow key={category.id}>
                <StyledTableCell align="center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.categoryName}
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
                <StyledTableCell>
                  {getParentCategoryName(category.parentId)}
                </StyledTableCell>
                <StyledTableCell >{category.categoryName}</StyledTableCell>
                <StyledTableCell>
                  <Link
                    target="_blank"
                    href={`/category/${category.identifier}`}
                    passHref
                    style={{ fontSize: "14px" }}
                  >
                    /{category.identifier}
                  </Link>
                </StyledTableCell>
                <StyledTableCell>
                  {category.categoryDescription?.length > 40
                    ? category.categoryDescription.slice(0, 40) + "..."
                    : category.categoryDescription}
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  sx={{ textTransform: "capitalize" }}
                >
                  {category.status === "active" ? (
                    <span
                      style={{
                        background: "#d4edda",
                        color: "#155724",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      {category.status}
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
                      {category.status}
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(category.createdAt ?? "").toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(category.updatedAt ?? "").toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    sx={{
                      borderRadius: "5px",
                      background: "#edefec",
                      width: "32px",
                      height: "32px",
                    }}
                    onClick={() => handleEditClick(category)}
                  >
                    <BiEditAlt size={15} color="#696969" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(category)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action buttons (Delete, Set Active, Set Inactive) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBulkActive}
            disabled={selectedCategories.length === 0} // Disable if no checkboxes are selected
          >
            Active
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkInactive}
            disabled={selectedCategories.length === 0} // Disable if no checkboxes are selected
          >
            Inactive
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDelete}
            disabled={selectedCategories.length === 0} // Disable if no checkboxes are selected
          >
            Delete
          </Button>
          <Button variant="text" color="secondary">
            Total Records : {filteredData.length}
          </Button>
        </div>

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
            style={{ minWidth: "32px" }}
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
            length: Math.ceil(filteredData.length / rowsPerPage),
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
                  Math.ceil(filteredData.length / rowsPerPage) - 1
                )
              )
            }
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                ? "contained"
                : "outlined"
            }
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleRight size={16} />
          </Button>
          <Button
            onClick={() =>
              setPage(Math.ceil(filteredData.length / rowsPerPage) - 1)
            }
            disabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            size="small"
            variant={
              page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                ? "contained"
                : "outlined"
            }
            style={{ minWidth: "32px", margin: "0" }}
          >
            <FaAngleDoubleRight size={16} />
          </Button>
        </Box>
      </div>

      <DeleteAction
        openDialog={openDeleteDialog}
        handleCancelDelete={() => setOpenDeleteDialog(false)}
        handleConfirmDelete={handleConfirmDelete}
      />
      {open && (
        <UpdateCategoryModal
          open={open}
          setOpen={setOpen}
          refetch={refetch}
          categoryData={data}
          currentCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default CategoryTable;
