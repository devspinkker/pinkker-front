import React, { useState, useEffect } from "react";

import "./Biography.css";
import { useSelector } from "react-redux";

import { updateBiography } from "../../../../services/user";
import { editProfile } from "../../../../services/backGo/user";
import { useNotification } from "../../../Notifications/NotificationProvider";
export default function Biography() {
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
      <h2>Ajustes del perfil</h2>

      <div className="biography-container">
        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Nombre de usuario</h4>
          </div>
          <div className="biography-input">
            <input disabled={true} type="text" placeholder={user.name} />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Puedes actualizar tu nombre de usuario.
            </p>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />
        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Biografía</h4>
          </div>
          <div className="biography-input">
            <input
              placeholder={user.biography}
              type="text"
              onChange={(e) => setBiography(e.target.value)}
            />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Descripción del panel "Acerca de" de la página de tu canal en
              menos de 200 caracteres.
            </p>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />

        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Sitio Web</h4>
          </div>
          <div className="biography-input">
            <input
              placeholder={
                user.website === null
                  ? "https://pinkker.tv/" + user.name
                  : user.website
              }
              type="text"
              onChange={(e) => setWebsite(e.target.value)}
            />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Cambiar el sitio web de tu cuenta!
            </p>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />

        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Sexo</h4>
          </div>
          <div className="biography-input">
            <div style={{ display: "flex", alignItems: "center" }}>
              <select
                onChange={(e) => setSex(e.target.value)}
                style={{
                  width: "250px",
                  marginRight: "0px",
                  padding: "8px",
                  marginLeft: "0px",
                }}
              >
                <option value={null}>Selecciona un genero</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No Definido">No Definido</option>
              </select>
            </div>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />

        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Fecha de nacimiento</h4>
          </div>
          <div className="biography-input">
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                onChange={(e) => setrDay(e.target.value)}
                style={{
                  marginRight: "2px",
                  width: "100px",
                  fontSize: "15px",
                  padding: "8px",
                  marginLeft: "0px",
                }}
                placeholder="Día 02"
                type="number"
              />
              <select
                onChange={(e) => setrMonth(e.target.value)}
                style={{
                  width: "250px",
                  marginRight: "0px",
                  padding: "8px",
                  marginLeft: "0px",
                }}
                defaultValue="1"
              >
                <option value="01">Mes</option>
                <option value="01">Enero</option>
                <option value="02">Febrero</option>
                <option value="03">Marzo</option>
                <option value="04">Abril</option>
                <option value="05">Mayo</option>
                <option value="06">Junio</option>
                <option value="07">Julio</option>
                <option value="08">Agosto</option>
                <option value="09">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <input
                onChange={(e) => setrYear(e.target.value)}
                style={{
                  marginLeft: "2px",
                  width: "125px",
                  fontSize: "15px",
                  padding: "8px",
                }}
                placeholder="Año 2000"
                type="number"
              />
            </div>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />

        <div className="biography-content">
          <div style={{ width: "20%", textAlign: "left", marginLeft: "20px" }}>
            <h4>Situación sentimental</h4>
          </div>
          <div className="biography-input">
            <div style={{ display: "flex", alignItems: "center" }}>
              <select
                onChange={(e) => setSentimental(e.target.value)}
                style={{
                  width: "250px",
                  marginRight: "0px",
                  padding: "8px",
                  marginLeft: "0px",
                }}
              >
                <option vvalue={null}>Selecciona una opción</option>
                <option value="Relación estable">Relación estable</option>
                <option value="Matrimonio">Matrimonio</option>
                <option value="Soltero/a">Soltero/a</option>
              </select>
            </div>
          </div>
        </div>
        <hr style={{ border: "1px solid #2b2b2b8f" }} />

        <div style={{ textAlign: "right", padding: "20px" }}>
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
