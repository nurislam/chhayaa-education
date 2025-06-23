 
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { Box } from "@mui/material"; 

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box>
      <Header />
      {children}
      <Footer />
    </Box>
  );
}
