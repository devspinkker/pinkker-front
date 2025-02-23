import React, { useState } from 'react'
import DashboarLayout from '../../DashboarLayout'
import { Box, Button, Grid, Modal, Tab, Tabs, TextField, Typography } from '@mui/material'

function Comunidad({ user, isMobile }) {
  const [tabValue, setTabValue] = useState(1);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const badges = [
    "Base", "2 meses", "3 meses", "6 meses", "9 meses", "1 año", "1 año y medio", "2 años",
    "2 años y medio", "3 años", "3 años y medio", "4 años", "4 años y medio", "5 años", "5 años y medio",
    "6 años", "6 años y medio", "7 años", "7 años y medio", "8 años"
  ];
  const [open, setOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleOpen = (badge) => {
    setSelectedBadge(badge);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  return (
    <DashboarLayout user={user} isMobile={isMobile}>
      <Grid style={{ padding: 15 }}>
        <Typography style={{ color: 'white', textAlign: 'left', width: 850, margin: '0 auto', fontWeight: 800, fontSize: '18px' }}>Comunidad</Typography>

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
            <Tab label="Emotes" value={1} />
            <Tab label="Insignias de suscriptor" value={2} />


          </Tabs>

          {tabValue === 1 &&
            <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Typography style={{ fontWeight: 'bold' }}>Emotes del canal</Typography>
                <Typography>Se pueden añadir hasta 60 emotes</Typography>

                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
                <Grid container spacing={1} columns={10} sx={{ justifyContent: "flex-start" }} style={{ display: 'flex', flexWrap: 'wrap' }}>

                  <Button
                    variant="contained"
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: "#1E1E1E",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textTransform: "none",
                    }}

                  >
                    +
                  </Button>

                </Grid>

              </Box>
              <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Typography style={{ fontWeight: 'bold' }}>Prefijo</Typography>
                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>

                <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '10px' }}>

                  <TextField
                    fullWidth
                    disabled
                    style={{ width: "100%", cursor: "not-allowed" }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "white !important", // Borde blanco
                        },
                        "&:hover fieldset": {
                          borderColor: "white !important", // Borde en hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "white !important", // Borde en focus
                        },
                        "&.Mui-disabled fieldset": {
                          borderColor: "white !important", // Borde blanco en estado deshabilitado
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "white !important", // Texto en blanco forzado
                        WebkitTextFillColor: "white !important", // Para navegadores que lo ponen en gris
                        "&::placeholder": {
                          color: "white !important", // Placeholder en blanco
                          opacity: 1, // Asegura visibilidad
                        },
                      },
                      "& .Mui-disabled": {
                        color: "white !important",
                        WebkitTextFillColor: "white !important",
                        "&::placeholder": {
                          color: "white !important",
                          opacity: 1,
                        },
                      },
                    }}
                    placeholder={user?.NameUser || "Placeholder"}
                  />





                </Grid>
              </Box>


            </Grid>
          }


          {tabValue === 2 &&
            <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Typography style={{ fontWeight: 'bold' }}>Insignias de suscriptor</Typography>
                <Typography>Las insignias de suscriptor les permiten a los usuarios del chat mostrar cuánto tiempo han estado suscritos a tu canal. Cuando alguien se suscribe, se mostrará automáticamente una insignia junto a su nombre de usuario según los meses que llevan suscritos.</Typography>

                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
                <Grid container spacing={1} columns={10} sx={{ justifyContent: "center" }} style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {badges.map((badge, index) => (
                    <Grid item key={index} xs={1} sx={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        sx={{
                          width: 64,
                          height: 64,
                          backgroundColor: "#1E1E1E",
                          color: "white",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "none",
                        }}
                        onClick={() => handleOpen(badge)}
                      >
                        +
                      </Button>
                      <Typography variant="caption" sx={{ color: "white", mt: 1, whiteSpace: "nowrap" }}>
                        {badge}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

              </Box>

              <Modal open={open} onClose={handleClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "#1E1E1E",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 3,
                    color: "white",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Insignia {selectedBadge}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 100,
                      border: "1px dashed gray",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    Vista previa de la insignia
                  </Box>
                  <Button fullWidth variant="contained" sx={{ mb: 1 }}>
                    Subir desde un dispositivo local
                  </Button>
                  <Typography variant="body2" sx={{ fontSize: 12, mb: 2 }}>
                    Por favor, sube un archivo PNG o JPG cuadrado de 36×36 px. El tamaño máximo de
                    archivo es de 977KB.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="outlined" color="inherit" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button variant="contained" color="success">
                      Guardar
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Grid>
          }
        </Box>

      </Grid >



    </DashboarLayout >
  )
}

export default Comunidad