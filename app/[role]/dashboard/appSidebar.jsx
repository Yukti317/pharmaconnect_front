"use client";

import { Calendar, ChevronDown, ChevronRight, CloudCog, Contact, FileOutput, Home, Inbox, LayoutDashboardIcon, LogOutIcon, Package, Plus, Quote, Receipt, ReceiptText, Search, Settings, User2, Users } from "lucide-react"
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
    useSidebar,
} from "@/components/ui/sidebar"
import logo from '../../../public/assets/logo.png'
import Image from "next/image"
import { Roboto_Slab } from "next/font/google";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const role = localStorage.getItem('userrole')

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: `/${role}/dashboard`,
        icon: LayoutDashboardIcon,
        roles: ['admin', 'manager', 'bde']
    },
    {
        title: "Users Management",
        url: "#",
        icon: User2,
        roles: ['admin', 'manager'],
        submenu: [
            {
                title: 'Add User',
                url: `/${role}/dashboard/users`,
                icon: Plus,
            },
            {
                title: 'User List',
                url: `/${role}/dashboard/userlist`,
                icon: Users,
            },
        ]
    },
    {
        title: "Products",
        url: `/${role}/dashboard/product`,
        icon: Package,
         roles:['admin','manager','bde'],
    },
    {
        title: "Leads",
        url: `/${role}/dashboard/leads`,
        icon: Contact,
         roles:['admin','manager','bde'],
    },
    {
        title: "Quotations",
        url: "#",
        icon: ReceiptText,
         roles:['admin','manager','bde']
    },
    {
        title: "Exports",
        url: "#",
        icon: FileOutput,
         roles:['admin','manager','bde']
    },
    {
        title: "LogOut",
        action: 'logout',
        icon: LogOutIcon,
         roles:['admin','manager','bde']
    },

]
export const robotoSlab = Roboto_Slab({
    weight: ['600'], // You can add more weights if needed, e.g., ['400', '600']
    subsets: ['latin'],
    variable: '--font-roboto-slab',
});
export function AppSidebar() {
    const [openMenu, setOpenMenu] = useState({}); // track all submenu states
    const [showlogoutModal, setShowLogoutModal] = useState(false)
    const router = useRouter()
    const toggleMenu = (title) => {
        setOpenMenu((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };
    const { state } = useSidebar();
    const handleLogout = () => {
        setShowLogoutModal(true);
    };
    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userrole");
         window.location.href = "/login"
    };

    return (
        <>
            <Sidebar collapsible="icon" variant="sidebar">
                <SidebarHeader>
                    {state === "expanded" ? (
                        <>
                            <div className="d-flex align-items-center">
                                <Image src={logo} alt="logo" className=" w-16" />
                                <span className={`text-xl text-white ${robotoSlab.className}`}>PharmaConnect</span>
                            </div>
                        </>
                    ) : (
                        <Image src={logo} alt="logo" className="  w-16" />
                    )}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.filter((item) => !item.roles || item.roles.includes(role)).map((item) => (
                                    <SidebarMenuItem key={item.title}>

                                        <SidebarMenuButton asChild onClick={(e) => {
                                            if (item.action === "logout") {
                                                e.preventDefault();
                                                handleLogout()
                                                return;
                                            }

                                            if (item.submenu) {
                                                e.preventDefault();
                                                toggleMenu(item.title);
                                            }
                                        }} className="group">

                                            <a href={item.url || '#'} style={{ textDecoration: 'none' }} className="sidebarmenutext">

                                                <item.icon className="icon" />
                                                <span className=" sidebartext group-data-[collapsible=icon]:hidden" >
                                                    {item.title}
                                                </span>
                                                {/* Arrow for submenu */}
                                                {item.submenu && (
                                                    <span className="ml-auto">
                                                        {openMenu[item.title] ? (
                                                            <ChevronDown size={18} />
                                                        ) : (
                                                            <ChevronRight size={18} />
                                                        )}
                                                    </span>
                                                )}
                                            </a>

                                        </SidebarMenuButton>

                                        {item.submenu && openMenu[item.title] && (
                                            <div className=" mt-2">
                                                {item.submenu.map((sub) => (
                                                    <SidebarMenuButton
                                                        key={sub.title}
                                                        asChild
                                                        className="group flex items-center gap-2 text-gray-300 hover:text-white sidebarmenutext"
                                                    >
                                                        <a href={sub.url} style={{ textDecoration: "none" }}>
                                                            <sub.icon className="icon" />
                                                            <span className="sidebartext group-data-[collapsible=icon]:hidden">
                                                                {sub.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                ))}
                                            </div>
                                        )}



                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>

                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

            </Sidebar>
            {showlogoutModal && (
                <>

                    <Dialog open={showlogoutModal} onOpenChange={setShowLogoutModal}>
                        <DialogContent className=' p-4 w-full  m-auto  overflow-auto'>
                            <DialogTitle className='text-center fs-5'>Are you sure you want to logout?</DialogTitle>
                            <DialogFooter>
                                <div className="flex justify-end align-items-center gap-3">
                                    <Button
                                        onClick={() => setShowLogoutModal(false)}
                                        style={{ width: '50%' }}
                                        className="px-4 commonbtn mt-0 py-2 border rounded-2xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmLogout}
                                        style={{ width: '50%' }}
                                        className="commonbtn  px-4 py-2 mt-0 "
                                    >
                                        Logout
                                    </Button></div>
                            </DialogFooter>
                        </DialogContent></Dialog>
                </>
            )}
        </>
    )

}