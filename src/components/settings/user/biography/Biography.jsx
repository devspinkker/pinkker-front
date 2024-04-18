import React, { useState, useEffect } from "react";

import "./Biography.css";
import { useSelector } from "react-redux";

import { updateBiography } from "../../../../services/user";
import { editProfile } from "../../../../services/backGo/user";
import { useNotification } from "../../../Notifications/NotificationProvider";
import { TbEdit } from "react-icons/tb";
import { Grid } from "@mui/material";
export default function Biography(props) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);
  const alert = useNotification();
  const [biography, setBiography] = useState(null);
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState(null);
  const [website, setWebsite] = useState(null);
  const [sex, setSex] = useState(null);
  const [rDay, setrDay] = useState(20);
  const [rMonth, setrMonth] = useState(12);
  const [rYear, setrYear] = useState(2000);
  const [sentimental, setSentimental] = useState(null);

  useEffect(() => {
    // if (user != null && user != undefined && user != []) {
    //   setBiography(user.biography);
    //   setCountry(user.countryInfo?.country);
    //   setPhone(user.phone);
    //   setWebsite(user.website);
    //   setSentimental(user.situation);
    //   let birthDate = new Date(user.birthDate);
    //   setrDay(birthDate.getDate());
    //   setrMonth(birthDate.getMonth());
    //   setrYear(birthDate.getFullYear());
    // }
  }, [user]);

  async function handleSubmit() {
    let token = window.localStorage.getItem("token");
    const birthDate = `${rYear}-${rMonth}-${String(rDay).padStart(2, "0")}`;
    const data = await editProfile(token, {
      biography,
      country,
      Phone: phone,
      Website: website,
      birthDate,
      situation: sentimental,
    });
    if (data.error) {
      window.scrollTo(0, 0);
      alert({ type: "ERROR", message: "error" });
      return;
    }
    if (data.data.message == "ok") {
      window.scrollTo(0, 0);
      alert({ type: "SUCCESS", message: data.data.msg });
    }
  }

  return (
    <div className="biography-body">
      <h3>Acerca de</h3>

      <div className="biography-container">
        <div className="biography-content">
          <div style={{ textAlign: "left" }}>
            <h4>Nombre de usuario</h4>
          </div>
          <div className="biography-input">
            <p>{props.user.NameUser}</p>
            <Grid style={{ fontSize: '24px', cursor: 'pointer' }}>

              <TbEdit />
            </Grid>
            {/* <input disabled={true} type="text" placeholder={props.user.NameUser} /> */}

          </div>
        </div>

        <div className="biography-content">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}} >
            <h4>Biografía y Usuario </h4>
            <TbEdit style={{ fontSize: '24px', cursor: 'pointer' }} />

          </div>
          <div className="biography-input" style={{display:'flex', flexDirection:'column', gap:'5px'}}>
            <input
              placeholder={props.user.biography}
              type="text"
              onChange={(e) => setBiography(e.target.value)}
            />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Descripción del panel "Acerca de" de la página de tu canal en
              menos de 200 caracteres.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right", padding: '5px 0px' }}>
          <button
            style={{ width: "105px" }}
            onClick={() => handleSubmit()}
            className="biography-button pink-button"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
