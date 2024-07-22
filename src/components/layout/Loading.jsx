// Loading.js

import React from 'react';
import logo from './LOGOPINKKER.png'; // Importa el logo de tu empresa o imagen de carga
import './loading.css'
import loader from './loaderpinkker.png'
const Loading = () => {
    return (
        <div className="loading-container">
            <img src={loader} alt="Logo de pinkker"  className="logo blink-animation" />
        </div>
    );
};

export default Loading;
