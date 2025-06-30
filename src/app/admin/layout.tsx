"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";
import { ROUTES } from "@utils/routes";
import { createTheme } from "@mui/material/styles";
import { AppProvider, type Session, type Router as ToolpadRouter } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider } from "@toolpad/core/internal";        
import { transformNavigation } from "@/utils/transformNavigation";
import { useModulesQuery } from "@/data/module/use-module.query";  

interface DashboardLayoutProps {
  children: ReactNode;
}

const adminTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function DashboardOnlyLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authCredentials = getAuthCredentials();

  useEffect(() => {
    if (!isAuthenticated(authCredentials)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [router, authCredentials]);

  const { data: modules } = useModulesQuery({
    where: { parentId: 0 },
    order: ["ordering ASC"],
    include: [
      {
        relation: "children",
        scope: {
          order: ["ordering ASC"],
        },
      },
    ],
  });
  const navigation = transformNavigation(modules || []);

  const toolpadRouter: ToolpadRouter = {
    pathname: pathname || "",
    searchParams: searchParams || new URLSearchParams(),
    navigate: (url: string | URL) => router.push(typeof url === "string" ? url : url.toString()),
  };

  const adminWindow = typeof window !== "undefined" ? window : undefined;

  const [session, setSession] = React.useState<Session | null>({
    user: {
      name: authCredentials?.firstName,
      email: authCredentials?.email,
      image: "/icon.png",
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: authCredentials?.firstName,
            email: authCredentials?.email,
            image: "/icon.png",
          },
        });
      },
      signOut: () => {
        router.replace(ROUTES.LOGOUT);
      },
    };
  }, []);

  return (
    <DemoProvider window={adminWindow}>
      <AppProvider
        navigation={navigation}
        branding={{
          logo: <img src="/logo-new.png" alt="Custom CMS Logo" />,
          title: "",
          homeUrl: "/admin/dashboard",
        }}
        session={session}
        authentication={authentication}
        router={toolpadRouter}
        theme={adminTheme}
        window={adminWindow}
      >
        <DashboardLayout>
          {/* <AdminBreadcrumbs /> */}
          {children}
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}
