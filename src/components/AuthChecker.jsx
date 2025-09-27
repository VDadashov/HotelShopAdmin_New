import { useEffect } from "react";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AuthChecker({ children }) {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const { data, isError, isPending } = useGet("profile", ENDPOINTS.profile);

  
  useEffect(() => {
    if (!token || isError) {
      Cookies.remove("token");
      navigate("/login");
    }
  }, [token, isError, navigate]);

  if (isPending || (token && !data && !isError)) {
    return <div />; // və ya skeleton göstərə bilərsən
  }

  return children;
} 