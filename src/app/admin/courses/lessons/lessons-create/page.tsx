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
  useDeleteLesson,
  useLessonsQuery,
  useUpdateLessonById,
} from "@data/lessons/use-lessons.query";

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

export default function LessonCreate() {
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
  } = useLessonsQuery({});

  // Fetch categories
  const { data: categories = [] } = useCategoryQuery({
    where: { categoryType: "course", deleted: 0 },
    order: ["createdAt DESC"],
  });

  // Delete Post Mutation
  const { mutate: deletePost } = useDeleteLesson();
  const { mutate: updatePageStatus } = useUpdateLessonById();

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
       

       hello
 
    </Box>
  );
}
