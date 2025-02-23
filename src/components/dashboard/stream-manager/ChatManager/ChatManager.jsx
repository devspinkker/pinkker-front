import React, { useState } from 'react'
import DashboarLayout from '../../DashboarLayout'
import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function ChatManager({ user, isMobile }) {
    const [tabValue, setTabValue] = useState(1);
    const [preferences, setPreferences] = useState({
        allowLinks: false,
        showAllTime: true,
        showMonthly: true,
        showWeekly: true,
    });

    const handleChange = (event) => {
        setPreferences({
            ...preferences,
            [event.target.name]: event.target.checked,
        });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    const options = [
        { name: "Contenido sexual", description: "Me gustaría evitar ver contenido relacionado con relaciones, masturbación, porno, juguetes sexuales u órganos sexuales.", value: "Mínimo" },
        { name: "Discurso de odio", description: "Me gustaría evitar ver contenido que incluya estereotipos, insultos, ideologías de odio o sugieran que los derechos de los grupos protegidos son inmorales.", value: "Máximo" },
        { name: "Violencia", description: "Estoy abierto a conversaciones sobre la violencia, incluso si se promueve la violencia, destrucción de la propiedad, acción militar o si se habla de autolesiones.", value: "Sin filtrar" },
        { name: "Bullying", description: "Estoy dispuesto a participar en conversaciones que incluyan insultos racistas o insultos hacia discapacidades, que fomenten la autolesión y sugieran amenazas violentas.", value: "Sin filtrar" },
        { name: "Drogas", description: "Me parecen bien las conversaciones que describen la compra, el consumo y la distribución de drogas adictivas y recreativas.", value: "Sin filtrar" },
        { name: "Armas", description: "Me parecen bien las discusiones sobre la compra, venta, uso y construcción de armas (armas de fuego, cuchillos y explosivos).", value: "Sin filtrar" },
        { name: "Incoherencias", description: "Bloquear el spam de teclado y las frases o palabras totalmente incomprensibles (Ej: 'fkfhjfgkdfhsd', 'c3nf$qc rgbu').", switch: true },
        { name: "Spam", description: "Bloquear cualquier texto que intente redirigirme mediante enlaces, direcciones de correo electrónico o números de teléfono a un sitio web o plataforma diferentes.", switch: true }
    ];

    const [selectedFilters, setSelectedFilters] = useState(options);

    const handleFilterChange = (index, newValue) => {
        const updatedFilters = [...selectedFilters];
        updatedFilters[index].value = newValue;
        setSelectedFilters(updatedFilters);
    };

    const [age, setAge] = React.useState('');

    const handleChangeAge = (event) => {
        setAge(event.target.value);
    };

    return (
        <DashboarLayout user={user} isMobile={isMobile}>
            <Grid style={{ padding: 15 }}>
                <Typography style={{ color: 'white', textAlign: 'left', width: 850, margin: '0 auto', fontWeight: 800, fontSize: '18px' }}>Chat</Typography>

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
                        <Tab label="Moderación de mensaje" value={1} />
                        <Tab label="Acceso" value={2} />
                        <Tab label="Mostrar" value={3} />
                    </Tabs>


                    {
                        tabValue === 1 &&
                        <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Grid>
                                    <Typography style={{ fontWeight: 'bold' }}>Moderación de IA</Typography>
                                    <Typography>Moderación por IA usa la tecnología de machine-learning para encontrar mensajes inapropiados o potencialmente peligrosos, basándose en tus preferencias de la comunidad. Algunas palabras o frases nunca serán permitidas en KICK, independientemente de tus ajustes personales más abajo. Los mensajes eliminados por la Inteligencia Artificial se mostrarán como 'Moderador IA', para que sea fácil de identificar para tí y para tus moderadores, y los ayude a redefinir los filtros del canal.</Typography>
                                </Grid>

                                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>

                                <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                                    <Grid style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Typography style={{ fontWeight: 'bold' }}>Nivel General </Typography>
                                        <Typography>Ten en cuenta que 'Máximo' incluye todos los filtros incluidos en 'Mínimo' y 'Moderado'</Typography>
                                    </Grid>

                                    <Grid sx={{ color: "#fff" }}>
                                        {/* Sección de niveles generales */}

                                        <Box sx={{ display: "flex", gap: 1, mb: 3, width: '100%' }}>
                                            {["Sin filtrar", "Mínimo", "Moderado", "Máximo", "Personalizado"].map((level, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={level === "Personalizado" ? "contained" : "outlined"}
                                                    sx={{
                                                        bgcolor: level === "Personalizado" ? "#f16397" : "transparent",
                                                        borderColor: "#fff",
                                                        color: "#fff",
                                                        "&:hover": { bgcolor: "#f16397", borderColor: "#f16397" }
                                                    }}
                                                    style={{ width: "100%" }}
                                                >
                                                    {level}
                                                </Button>
                                            ))}
                                        </Box>

                                        {/* Lista de opciones */}
                                        {selectedFilters.map((item, index) => (
                                            <Box key={index} sx={{ borderBottom: "1px solid #333", py: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                                    {item.description}
                                                </Typography>

                                                {item.switch ? (
                                                    <Switch defaultChecked sx={{ color: "#f16397" }} />
                                                ) : (
                                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
                                                        <Button variant="outlined" size="small" sx={{ borderColor: "#fff", color: "#fff", "&:hover": { borderColor: "#f16397" } }}>
                                                            {"<"}
                                                        </Button>
                                                        <Typography sx={{ mx: 1 }}>{item.value}</Typography>
                                                        <Button variant="outlined" size="small" sx={{ borderColor: "#fff", color: "#fff", "&:hover": { borderColor: "#f16397" } }}>
                                                            {">"}
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Typography style={{ fontWeight: 'bold' }}>Palabras baneadas</Typography>
                                <Typography>Las palabras agregadas aquí se bloquearán automáticamente en tu chat.</Typography>
                                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
                                <Grid style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                    <TextField style={{ width: '100%', borderColor: 'white', color: 'white' }} placeholder='Ingrese la palabra que quiere banear' />
                                    <Button style={{ color: 'white', backgroundColor: '#f16397' }}> Añadir</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {
                        tabValue === 2 &&
                        <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Typography style={{ fontWeight: 'bold' }}>Antigüedad de la cuenta</Typography>
                                <Typography>La antigüedad de la cuenta para chatear debe ser de</Typography>
                                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>

                                <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>

                                    <FormControl style={{ width: '75%' }}>
                                        <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            label="Age"
                                            onChange={handleChangeAge}
                                            sx={{
                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Borde blanco
                                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Borde en hover
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // Borde en focus
                                                "& .MuiSelect-icon": { color: "white" }, // Ícono de flecha en blanco
                                                color: "white", // Texto en blanco
                                            }}
                                        >
                                            <MenuItem value={10}>Apagado</MenuItem>
                                            <MenuItem value={20}>1 Hora</MenuItem>
                                            <MenuItem value={30}>12 Horas</MenuItem>
                                            <MenuItem value={40}>1 Día</MenuItem>
                                            <MenuItem value={50}>1 Mes</MenuItem>
                                            <MenuItem value={60}>6 Meses</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Button style={{ color: 'white', backgroundColor: '#f16397' }}>Guardar Cambios</Button>
                                </Grid>
                            </Box>


                            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Typography style={{ fontWeight: 'bold' }}>Usuarios baneados</Typography>
                                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
                                <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '10px' }}>
                                    <TextField fullWidth sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "white" }, // Borde blanco
                                            "&:hover fieldset": { borderColor: "white" }, // Borde en hover
                                            "&.Mui-focused fieldset": { borderColor: "white" }, // Borde en focus
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "white", // Texto en blanco
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "white", // Placeholder en blanco
                                            opacity: 1, // Asegura que se vea
                                        },
                                    }} placeholder='Buscar por usuario' />

                                </Grid>
                            </Box>
                        </Grid>
                    }
                    {tabValue === 3 &&
                        <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Typography style={{ fontWeight: 'bold' }}>Preferencias</Typography>

                                <FormControlLabel
                                    control={<Checkbox name="allowLinks" checked={preferences.allowLinks} onChange={handleChange} />}
                                    label="Permitir que los espectadores compartan enlaces en el chat"
                                />

                                <FormControlLabel
                                    control={<Checkbox name="showAllTime" checked={preferences.showAllTime} onChange={handleChange} />}
                                    label="Mostrar tabla de posiciones de suscripciones regaladas desde siempre"
                                />

                                <FormControlLabel
                                    control={<Checkbox name="showMonthly" checked={preferences.showMonthly} onChange={handleChange} />}
                                    label="Mostrar tabla de posiciones de suscripciones regaladas del mes"
                                />

                                <FormControlLabel
                                    control={<Checkbox name="showWeekly" checked={preferences.showWeekly} onChange={handleChange} />}
                                    label="Mostrar tabla de posiciones de suscripciones regaladas de la semana"
                                />
                            </Box>

                            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <Typography style={{ fontWeight: 'bold' }}>Reglas del Chat</Typography>
                                <Typography>Los usuarios que chatean por primera vez deberán aceptar las reglas de tu chat antes de poder participar en él. (puedes dejarlo en blanco para no mostrar reglas)</Typography>
                                <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
                                <Grid style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '10px' }}>
                                    <TextField multiline rows={4} fullWidth sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "white" }, // Borde blanco
                                            "&:hover fieldset": { borderColor: "white" }, // Borde en hover
                                            "&.Mui-focused fieldset": { borderColor: "white" }, // Borde en focus
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "white", // Texto en blanco
                                        },
                                        "& .MuiInputBase-input::placeholder": {
                                            color: "white", // Placeholder en blanco
                                            opacity: 1, // Asegura que se vea
                                        },
                                    }} placeholder='-Sé respetuoso' />
                                    <Button style={{ color: 'white', backgroundColor: '#f16397' }}> Añadir</Button>
                                </Grid>

                            </Box>
                        </Grid>
                    }



                </Box>
            </Grid>
        </DashboarLayout>

    )
}

export default ChatManager