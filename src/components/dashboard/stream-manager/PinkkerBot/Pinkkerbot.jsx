import React, { useState } from 'react'
import DashboarLayout from '../../DashboarLayout'
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'

function Pinkkerbot({ user, isMobile }) {
    const [tabValue, setTabValue] = useState(1);
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
    return (
        <DashboarLayout user={user} isMobile={isMobile}>
            <Grid style={{ padding: 15 }}>
                <Typography style={{ color: 'white', textAlign: 'left', width: 850, margin: '0 auto', fontWeight: 800, fontSize: '18px' }}>Pinkker Bot</Typography>

                <Box sx={{ maxWidth: 800, color: '#fff', borderRadius: 2, p: 3, margin: '0 auto' }}>
                    {/* Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        textColor="inherit"
                        TabIndicatorProps={{ sx: { backgroundColor: '#f16397', height: 3 } }} // Línea verde más gruesa
                        sx={{
                            '& .MuiTab-root': {
                                color: '#fff', // Color de texto blanco
                                textTransform: 'none', // Evita mayúsculas automáticas
                                fontSize: '1rem', // Ajusta el tamaño de fuente
                                fontWeight: 500, // Negrita media
                            },
                            '& .MuiTab-root.Mui-selected': {
                                color: '#fff', // Mantiene el color blanco cuando está seleccionado
                            },
                        }}
                        style={{ borderBottom: '1px solid #3a3b3f' }}
                    >
                        <Tab label="Timers" value={1} />
                        <Tab label="Comandos" value={2} />
                        <Tab label="Sorteos" value={2} />

                    </Tabs>
                </Box>
            </Grid>
        </DashboarLayout>
    )
}

export default Pinkkerbot