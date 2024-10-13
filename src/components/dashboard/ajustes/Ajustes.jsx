import React, { useState } from 'react'
import DashboarLayout from '../DashboarLayout'
import { CiStreamOn } from 'react-icons/ci'
import { Grid } from '@mui/material'
import { useNotification } from '../../Notifications/NotificationProvider';

function Ajustes({ user, isMobile }) {
    const alert = useNotification();
    const [showKey, setShowKey] = useState(false);
    const [showComandosList, setShowComandosList] = useState(false);


    const copyToClipboard = (text) => {
        var textField = document.createElement("textarea");
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
        alert({ type: "SUCCESS", message: "Copiado correctamente!" });
    };
    return (
        <DashboarLayout user={user} isMobile={isMobile}>
            
        </DashboarLayout>

    )
}

export default Ajustes