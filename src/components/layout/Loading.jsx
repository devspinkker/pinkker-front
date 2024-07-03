// Loading.js

import React from 'react';
import logo from './LOGOPINKKER.png'; // Importa el logo de tu empresa o imagen de carga
import './loading.css'

const Loading = () => {
    return (
        <div className="loading-container">
            <img src={logo} alt="Logo de pinkker"  className="logo blink-animation" />
        </div>
    );
};

export default Loading;
