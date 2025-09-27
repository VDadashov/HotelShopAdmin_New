import React from "react";
import Header from "@/layouts/Header";
import {SiderBar} from "@/layouts/SiderBar";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import AuthChecker from "@/components/AuthChecker";

const AdminRoot = () => {
  return (
    <AuthChecker>
      <SidebarProvider>
        <SiderBar />
        <SidebarInset>
          <Header />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </AuthChecker>
  );
};

export default AdminRoot;
