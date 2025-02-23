import React, { useState } from 'react'
import DashboarLayout from '../../DashboarLayout'
import { Box, Grid, Typography } from '@mui/material'
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";
import { FaRegCopy } from 'react-icons/fa6';
import { RiResetRightFill } from "react-icons/ri";
import { AiOutlineHistory } from 'react-icons/ai';


function ClaveStream({ user, isMobile }) {
  const [showKey, setShowKey] = useState(false);
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
      <Grid style={{ padding: 15 }}>
        <Typography style={{ color: 'white', textAlign: 'left', width: 850, margin: '0 auto', fontWeight: 800, fontSize: '18px' }}>Servidor y Clave de Stream</Typography>

        <Box sx={{ maxWidth: 800, color: '#fff', borderRadius: 2, p: 3, margin: '0 auto' }}>

          <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Typography style={{ fontWeight: 'bold' }}>Servidor</Typography>
              <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
              <Grid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "88%",
                }}
              >
                <input
                  value={process.env.REACT_APP_RTMPSTARTSTREAM}
                  className="settingstream-input"
                  style={{ width: "100%" }}
                  type="text"
                  readOnly
                />


              </Grid>
            </Box>
          </Grid>

          <Grid style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Box sx={{ mt: 3 }} style={{ backgroundColor: '#131418', padding: 20, borderRadius: 5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Typography style={{ fontWeight: 'bold' }}>Clave de retransmisión</Typography>
              <Grid style={{ borderBottom: '1px solid #3a3b3f' }}></Grid>
              <Grid
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  
                }}
              >
                <input
                  value={showKey ? user?.cmt : "******************"}
                  className="settingstream-input"
                  style={{ width: "100%" }}
                  type="text"
                />

                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="button-copy"
                  >
                    {showKey ? <BiSolidHide />: <BiSolidShow />}
                  </button>

                  <button
                    onClick={() => copyToClipboard(user?.cmt)}
                    className="button-copy"
                  >
                   <FaRegCopy />
                  </button>
                  <button className="button-copy"> <AiOutlineHistory />                  </button>
                </div>
              </Grid>

            </Box>
          </Grid>


        </Box>
      </Grid>
    </DashboarLayout>

  )
}

export default ClaveStream