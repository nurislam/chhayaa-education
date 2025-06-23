import "./globals.css";
import TanstackProvider from "@/components/tanstackProvider";
import { ToastContainer } from "react-toastify"; 
import { Metadata } from "next";

const isDev = process.env.NODE_ENV === "development"; 
 
export const metadata: Metadata = {
  title: {
    template: '%s | CMS',
    default: 'Custom CMS', 
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={isDev}>    
      <body className={`antialiased`}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
