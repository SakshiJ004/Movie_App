import { Box, Typography } from "@mui/material";

export default function SidebarCard({ title, subtitle, count, image }) {
    return (
        <Box sx={{
            bgcolor: '#1e293b',
            borderRadius: 2,
            p: 2,
            border: '1px solid #334155',
            '&:hover': { borderColor: '#475569' },
            transition: 'border-color 0.2s',
            cursor: 'pointer'
        }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                <img
                    src={image}
                    alt={title}
                    style={{ width: 64, height: 96, objectFit: 'cover', borderRadius: 4 }}
                />

                <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                        {title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, fontSize: '0.875rem' }}>
                        {subtitle}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {count}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
