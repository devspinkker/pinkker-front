// Loading.js

import React from 'react';
import logo from './LOGOPINKKER.png'; // Importa el logo de tu empresa o imagen de carga
import './loading.css'

const Loading = () => {
    return (
        <div className="loading-container">
            <img src='https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png' alt="Logo de pinkker"  className="logo blink-animation" />
        </div>
    );
};

export default Loading;
