import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ReportData {
  title: string;
  createdAt: string;
  amount: number;
}

/** Export Data as CSV */
export const exportToCSV = (data: ReportData[], filename: string) => {
  const csvRows = [];
  const headers = ["Title",  "Created At","Amount"];
  csvRows.push(headers.join(","));

  data.forEach((row) => {
    const values = [
      row.title,
      new Date(row.createdAt).toLocaleDateString(),
      row.amount,
    ];
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  saveAs(blob, `${filename}.csv`);
};

/** Export Data as PDF */
export const exportToPDF = (data: ReportData[], filename: string) => {
  const doc = new jsPDF();
  doc.text("Report", 14, 10);

  const tableData = data.map((row) => [
    row.title,
    new Date(row.createdAt).toLocaleDateString(),
    typeof row.amount === "number" && !isNaN(row.amount)
      ? `$${row.amount.toFixed(2)}`
      : "$0.00",
    
  ]);

  (doc as any).autoTable({
    head: [["Title",  "Created At","Amount"]],
    body: tableData,
  });

  doc.save(`${filename}.pdf`);
};
