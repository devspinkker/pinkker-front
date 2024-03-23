import { Grid } from '@mui/material'
import React, { useState } from 'react'
import { Link } from "react-router-dom";

function CanalesRecomendados(props) {
    const formatViewers = (viewers) => {
        if (viewers >= 1000) {
            return (viewers / 1000).toFixed(1) + "k";
        } else {
            if (!viewers) {
                return 0;
            }
            return viewers;

        }
    };


    console.log('props.expanded', props)
    return (




        <Grid style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
                src={props.avatarStreamer}
                alt=""
                style={{
                    width: '35px',
                    height: '35px',
                    objectFit: 'cover',
                    borderRadius: "50%",
                }}
            />

            
                <Grid style={{ display:  props.abrir ? 'flex' : 'none', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', width: '100%' }}>
                    <Grid style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>


                        <Link

                            style={{ textDecoration: "none", padding: 0, fontSize: '14px', fontFamily: 'Inter', color: '#dedee3', fontWeight: 'bold' }}
                            to={"/" + props.streamer}
                        >
                            {props.streamer}
                        </Link>


                        <Grid style={{ display: 'flex', alignItems: 'center' }}>

                            <span id="pulsatingDot" />

                            <span style={{ color: '#dedee3', fontSize: '13px' }}>{formatViewers(props.spectators)}</span>


                        </Grid>
                    </Grid>

                    <Link to={"/categorie/" + props.categorie} style={{ padding: 0, fontSize: '12px', fontFamily: 'Inter', color: '#adadb8' }}>

                        {props.categorie}

                    </Link>
                </Grid>
                
        </Grid>



    )
}

export default CanalesRecomendados