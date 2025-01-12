// Loading.js

import React, { useEffect, useState } from 'react';
import logo from './LOGOPINKKER.png'; // Importa el logo de tu empresa o imagen de carga
import './loading.css'
import loader from './Chancho--dengue.webp'
import pinnkker from './Pinkker_dmzobi.png'
import { Box, LinearProgress } from '@mui/material';
const Loading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                }
                return Math.min(oldProgress + 1, 100); // Incrementa el progreso cada 40 ms
            });
        }, 30); // 40 ms * 100 iteraciones = 4000 ms (4 segundos)

        return () => {
            clearInterval(timer);
        };
    }, []);
    return (
        <div className="loading-container">
            <img src={loader} alt="Logo de pinkker" className="logo" style={{width:'15%'}}/>
            <img src={pinnkker} alt="Logo de pinkker" className="logo" style={{width:'20%'}} />
            {/* Barra de progreso */}
            <Box width="10%" mt={2}>
            <LinearProgress variant="determinate" value={progress} color="secondary" style={{borderRadius:'5px'}} />
            </Box>
        </div>
    );
};

export default Loading;
