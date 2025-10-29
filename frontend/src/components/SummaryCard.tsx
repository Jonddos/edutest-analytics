import { Card, CardContent, Typography } from "@mui/material";

interface SummaryCardProps {
    title: string;
    value: number | string;
    color?: string;
}

export default function SummaryCard({ title, value, color }: SummaryCardProps) {
    return (
        <Card sx={{ minWidth: 200, bgcolor: color || "background.paper" }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}
