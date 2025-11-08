import {AppBar, Toolbar, Typography, IconButton, Button} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

interface NavbarProps {
    toggleColorMode?: () => void;
    mode?: "light" | "dark";
}

export default function Navbar({ toggleColorMode, mode }: NavbarProps) {
    return (
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    EduTest Analytics
                </Typography>
                <Button
                    color="inherit"
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("role");

                        window.location.href = "/login";
                    }}
                >
                    Cerrar sesión
                </Button>
                <IconButton color="inherit" onClick={toggleColorMode}>
                    {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}
