import { type ReactNode } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
    children: ReactNode;
    toggleColorMode?: () => void;
    mode?: "light" | "dark";
}

export default function DashboardLayout({ children, toggleColorMode, mode }: Props) {
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar toggleColorMode={toggleColorMode} mode={mode} />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
