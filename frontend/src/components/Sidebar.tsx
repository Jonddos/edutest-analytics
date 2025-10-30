import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";
import { Home, School, BarChart } from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar />
            <List>
                <ListItem component={Link} to="/">
                    <ListItemIcon><Home color="primary" /></ListItemIcon>
                    <ListItemText primary="Inicio" />
                </ListItem>
                <ListItem component={Link} to="/evaluation">
                    <ListItemIcon><School color="primary" /></ListItemIcon>
                    <ListItemText primary="Evaluaciones" />
                </ListItem>
                <ListItem component={Link} to="/analytics">
                    <ListItemIcon><BarChart color="primary" /></ListItemIcon>
                    <ListItemText primary="Analítica" />
                </ListItem>
            </List>
        </Drawer>
    );
}
