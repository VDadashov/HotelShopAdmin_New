

import * as React from "react";
import { useLocation } from "react-router-dom";
import { LayoutGrid, Home, Layers, ShoppingCart, Image, Folder, UserCircle2, Briefcase, StickyNote, LayoutPanelTop, MessageSquare, Percent } from "lucide-react";
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function SiderBar({ ...props }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar(); // expanded/collapsed
  const isCollapsed = state === "collapsed";
  const { t } = useTranslation();

  const data = {
    navMain: [
      {
        label: t("common.dashboard"),
        url: "#",
        items: [
          {
            title: t("common.dashboard"),
            url: "/",
            icon: <Home className="size-4" />,
          },
          {
            title: t("common.brands"),
            url: "/brand",
            icon: <Briefcase className="size-4" />,
          },
          {
            title: t("common.categories"),
            url: "/category",
            icon: <Layers className="size-4" />,
          },
          {
            title: t("common.products"),
            url: "/product",
            icon: <ShoppingCart className="size-4" />,
          },
          // {
          //   title: t("galleryCategory.title"),
          //   url: "/gallery-category",
          //   icon: <Folder className="size-4" />,
          // },
          // {
          //   title: t("gallery.title"),
          //   url: "/gallery-item",
          //   icon: <Image className="size-4" />,
          // },
          {
            title: t("page.title"),
            url: "/page",
            icon: <StickyNote className="size-4" />,
          },
          {
            title: t("section.title"),
            url: "/section",
            icon: <LayoutPanelTop className="size-4" />,
          },
          {
            title: t("common.contacts"),
            url: "/contact",
            icon: <UserCircle2 className="size-4" />,
          },
          {
            title: t("common.testimonials"),
            url: "/testimonial",
            icon: <MessageSquare className="size-4" />,
          },
          {
            title: t("common.promos"),
            url: "/promo",
            icon: <Percent className="size-4" />,
          },
          // {
          //   title: t('common.settings'),
          //   url: "/settings",
          //   icon: <CogIcon className="size-4" />,
          // },
        ],
      },
    ],
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          className={`flex items-center px-2 py-3 select-none transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'gap-2 justify-start'
          }`}
        >
          <span className={`bg-[rgb(var(--primary-brand))] rounded-md flex items-center justify-center transition-all duration-200 ${isCollapsed ? 'p-1 scale-100' : 'p-1 scale-100'}`}>
            <LayoutGrid className="text-white size-5" />
          </span>
          {!isCollapsed && (
            <span className="text-base font-bold tracking-tight text-[rgb(var(--primary-brand))]">HotelShop</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.label}>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 mb-1 select-none">
              {item.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = item.url === "/" ? currentPath === "/" : currentPath.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={isCollapsed ? item.title : undefined}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors font-semibold ${
                          isActive
                            ? '!bg-[rgb(var(--primary-brand))] !text-black shadow' 
                            : 'hover:bg-[rgb(var(--primary-brand-hover))] hover:text-black'
                        }`}
                      >
                        <a href={item.url} className="flex items-center w-full">
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}