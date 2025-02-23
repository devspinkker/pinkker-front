import React, { useState } from 'react'
import DashboarLayout from '../../DashboarLayout'
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'

function Roles({ user, isMobile }) {
  const [tabValue, setTabValue] = useState(1);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <DashboarLayout user={user} isMobile={isMobile}>
      <Grid style={{ padding: 15 }}>
        <Typography style={{ color: 'white', textAlign: 'left', width: 850, margin: '0 auto', fontWeight: 800, fontSize: '18px' }}>Roles</Typography>

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
            <Tab label="Moderadores" value={1} />
            <Tab label="Vip's" value={2} />

          </Tabs>

          {
            tabValue === 1 &&
            <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Typography style={{ fontWeight: 'bold' }}>Moderadores del Canal</Typography>
                <Typography>Los moderadores son responsables de vigilar el chat para asegurarse de que las conversaciones se mantienen en orden, amigables y siguiendo los Términos y Condiciones.
                  Los moderadores no tienen tiempo de espera para crear clips.
                  Su tarea es mantener una interacción positiva de la comunidad mediante las siguientes acciones:</Typography>
                <ul style={{ paddingLeft: 15 }}>
                  <li style={{ fontWeight: 300, fontSize: '14px' }}>Suspende o banea usuarios</li>
                  <li style={{ fontWeight: 300, fontSize: '14px' }}>Gestionar spam</li>
                  <li style={{ fontWeight: 300, fontSize: '14px' }}>Habilita diferentes modos para el chat, como el modo lento, solo-seguidores, solo-suscriptores y solo-emotes</li>
                  <li style={{ fontWeight: 300, fontSize: '14px' }}>Inicia, gestiona encuestas o mensajes anclados</li>
                </ul>
                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
              </Box>
            </Grid>
          }
          {
            tabValue === 2 &&
            <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Typography style={{ fontWeight: 'bold' }}>Vips</Typography>
                <Typography>Aquí puedes añadir usuarios que tendrán la insignia VIP.</Typography>
                <Typography> Estarás limitado a 100 usuarios para la insignia VIP.</Typography>
                <Typography> Los VIPs no tienen tiempo de espera para crear clips.</Typography>
                
                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
              </Box>
            </Grid>
          }
        </Box>
      </Grid>
    </DashboarLayout>

  )
}

export default Roles