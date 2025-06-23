"use client"; 
import {
  Box, 
  Typography, 
} from "@mui/material"; 
import { usePagesQuery } from "@/data/pages/use-pages.query"; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Registering the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BalanceSheetGraph() {
  
  // Fetch balance sheet data
  const { data: records = [] } = usePagesQuery({
    where: { deleted: false },
    order: ["createdAt DESC"],
  });

  // Group data by Month
  const monthlySummary: Record<string, { totalEarning: number; totalExpense: number }> = {};

  records.forEach((record: any) => {
    const recordDate = new Date(record.createdAt);
    const recordMonth = recordDate.getMonth() + 1; // 0-based index
    const recordYear = recordDate.getFullYear();
    const key = `${recordYear}-${recordMonth.toString().padStart(2, "0")}`; // Format: YYYY-MM
 
    if (!monthlySummary[key]) {
      monthlySummary[key] = { totalEarning: 0, totalExpense: 0 };
    }

    if (record.payment_type === "debit") {
      monthlySummary[key].totalExpense += Number(record.amount);
    } else if (record.payment_type === "credit") {
      monthlySummary[key].totalEarning += Number(record.amount);
    }
  });

 

  
   

  return (
    <Box p={3}> 

      {/* Line Chart with Tooltips */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center"> 
        </Typography>
        
      </Box>
    </Box>
  );
}
