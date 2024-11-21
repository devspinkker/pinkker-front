import React, { useEffect, useState } from 'react'
import DashboarLayout from '../DashboarLayout'
import { Grid, Tab, Tabs, Typography } from '@mui/material'
import { getTweetUser } from '../../../services/backGo/tweet';

function Comentarios({ user, isMobile }) {
    const [tabIndex, setTabIndex] = useState(0);  // Para controlar el tab activo
    const [posteos, setPosteos] = useState(); // Para controlar el
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    // Función para obtener datos de Clips
    const fetchDataClips = async () => {
        const data = await getTweetUser(user?.id, 1, 1);
     
        setPosteos(data.data);
    };

    useEffect(() => {
        fetchDataClips();
    }, [user]);
  
    return (
        <DashboarLayout user={user} isMobile={isMobile}>
            <Typography style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>Comentarios</Typography>
            {/* Tabs para VODs y Clips */}
            <Tabs value={tabIndex} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                <Tab label="Posteos" style={{ color: 'white' }} />
                <Tab label="Clips" style={{ color: 'white' }} />
            </Tabs>

            {
                tabIndex === 0 &&
                (
                    <Grid style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: 5 }}>

                        {posteos?.map((post) => {
                            return (
                                <Grid style={{ display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgb(42, 46, 56)', padding: 10, borderRadius:'10px' }}>
                                    <Grid style={{ display: 'flex', alignItems: 'flex-start', gap:'10px' }}>
                                        <img src={post?.UserInfo?.Avatar} style={{ borderRadius: '50%', height: '60px', width: '60px' }} />
                                        <Grid style={{ display: 'flex', flexDirection: 'column', marginTop:'5px' }} >
                                            <Typography style={{ fontSize: 12, color: 'white' }}>{post?.UserInfo?.FullName} @{post?.UserInfo?.NameUser}</Typography>

                                            <Typography style={{ fontSize: 16, color: 'white' }}>{post?.Status}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )

                        })
                        }
                    </Grid>
                )
            }

        </DashboarLayout>
    )
}

export default Comentarios