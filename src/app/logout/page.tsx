"use client";
import { useEffect } from "react";
import Loader from "@components/ui/Loader";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AUTH_CRED, PRE_AUTH_CRED } from "@utils/constants";
import { ROUTES } from "@utils/routes";
import { useLogoutQuery } from "@data/user/use-logout.query";
import { toast } from "react-toastify";

function SignOut() {
  const { mutate: logout } = useLogoutQuery();
  const router = useRouter();

  useEffect(() => {
    logout(undefined, {
      onSuccess: () => {
        Cookies.remove(AUTH_CRED);
        Cookies.remove(PRE_AUTH_CRED);
        router.replace(ROUTES.LOGIN);
      },
      onError: () => {
        toast.error("Error logging out");
      },
    });
  }, [router, logout]);

  return <Loader />;
}

export default SignOut;
