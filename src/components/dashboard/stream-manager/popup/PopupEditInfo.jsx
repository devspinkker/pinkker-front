import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { dispatchLogin } from "../../../../redux/actions/authAction";
import { Link, useHistory, useLocation } from "react-router-dom";

import "./Popup.css";

import {
  updateStreamInfo,
  getStream,
} from "../../../../services/backGo/streams";
import Loader from "react-loader-spinner";

import SelectSearch from "react-select-search";

import { fuzzySearch } from "react-select-search";

import { useNotification } from "../../../Notifications/NotificationProvider";

import { getCategoriesWithLimit } from "../../../../services/backGo/streams";
import { getUserByIdTheToken } from "../../../../services/backGo/user";

export default function PopupEditInfo({ closePopup, stream, user }) {
  const alert = useNotification();

  const [title, setTitle] = useState("");
  const [notification, setNotification] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState([]);
  const [idiom, setIdiom] = useState("");

  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null); 
  const [thumbnailPermanent, setThumbnailPermanent] = useState(false); 
  const [authorizationToView, setAuthorizationToView] = useState({});


  useEffect(() => {
    setTitle(stream?.stream_title);
    setNotification(stream?.stream_notification);
    setCategory(stream?.stream_category);
    setTag(stream?.stream_tag);
    setIdiom(stream?.stream_idiom); 
    setThumbnailPermanent(stream?.StreamThumbnailPermanent || false);
    setAuthorizationToView(
      Object.keys(stream?.AuthorizationToView || {}).reduce((acc, key) => {
        acc[key] = stream?.AuthorizationToView[key]; // Copiar valores directamente
        return acc;
      }, {})
    );
    console.log(stream?.AuthorizationToView);
    
  
    async function fetchData() {
      const res = await getCategoriesWithLimit();
      if (res.data != null && res.message === "ok") {
        const s = [];
        const categorie = res.data;
        await categorie.map((categorie) =>
          s.push({ name: categorie.nombre, value: categorie.nombre })
        );
        setCategories(s);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit() {
    let token = window.localStorage.getItem("token");

    // Usar FormData para manejar imagen y datos
    const formData = new FormData();
    formData.append("title", title);
    formData.append("notification", notification);
    formData.append("category", category);
    formData.append("tag", tag.join(",")); // Convertir array en string
    formData.append("idiom", idiom);
    formData.append("StreamThumbnailPermanent", thumbnailPermanent);
    formData.append("keyTransmission", user.keyTransmission);

    if (thumbnail) {
      formData.append("ThumbnailImage", thumbnail);
    }
    formData.append("AuthorizationToView", JSON.stringify(authorizationToView));

    const data = await updateStreamInfo(token, formData); // Enviar como FormData
    if (data?.message !== "ok") {
      alert({ type: "ERROR", message: data });
    } else {
      alert({ type: "SUCCESS", message: data.message });
      closePopup();
    }
  }

  const tagsOptions = [
    { name: "Español", value: "Español" },
    { name: "English", value: "English" },
    { name: "IRL", value: "IRL" },
    { name: "Mobile", value: "Mobile" },
    { name: "Gaming", value: "Gaming" },
    { name: "Shooter", value: "Shooter" },
  ];
  const tagsOp = [];

  const getTagOptions = async () => {
    if (stream != null && stream != undefined) {
      await tagsOptions.map((tag2) => {
        if (!stream.stream_tag?.includes(tag2.name)) {
          if (!tag?.includes(tag2.name)) {
            tagsOp.push({ name: tag2.name, value: tag2.name });
          }
        }
      });
    }
  };

  getTagOptions();

  const onChangeCategory = (e) => {
    setCategory(e);
    if (e === "Charlando") {
      onChangeTag("IRL");
    }
  };
  const handleAuthorizationChange = (value, checked) => {
    setAuthorizationToView((prev) => ({
      ...prev, // Copia las claves existentes
      [value]: checked, // Actualiza la clave con el nuevo valor
    }));
  };
  
  
  const onChangeTag = async (e) => {
    if (tag?.includes(e)) {
      return;
    }

    if (tag?.length === 4) {
      return;
    }

    const [...newTag] = tag;
    newTag.push(e);
    setTag(newTag);
  };

  const removeTag = async (e) => {
    if (!tag?.includes(e)) {
      return;
    }
    const [...newTag] = tag;
    newTag.splice(newTag.indexOf(e), 1);
    setTag(newTag);
  };

  function getInfo() {
    if (stream != null) {
      return (
        <div>
          <div
             className="popup-content-class"
          >
            <div style={{ width: "30%" }}>
              <h3>Título</h3>
            </div>
            <div style={{ width: "70%" }}>
              <input
                maxLength={70}
                onChange={(e) => setTitle(e.target.value)}
                defaultValue={title}
                className="popupeditinfo-input"
                type="text"
                placeholder="Introduce un título"
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: "5px",
                  marginRight: "7px",
                }}
              >
                <p style={{ fontSize: "13px", color: "lightgray" }}>
                  Te quedan{" "}
                  <a style={{ color: "#ff60b2" }}>
                    {70 - title?.length} caracteres.
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div
             className="popup-content-class"
          >
            <div style={{ width: "30%" }}>
              <h3>Notificación de emisión</h3>
            </div>
            <div style={{ width: "70%" }}>
              <input
                onChange={(e) => setNotification(e.target.value)}
                className="popupeditinfo-input"
                type="text"
                placeholder={notification}
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: "5px",
                  marginRight: "7px",
                }}
              >
                <p style={{ fontSize: "13px", color: "lightgray" }}>
                  Te quedan{" "}
                  <a style={{ color: "#ff60b2" }}>
                    {30 - notification?.length} caracteres.
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div
               className="popup-content-class"
          >
            <div style={{ width: "30%" }}>
              <h3>Categoría</h3>
            </div>
            <div style={{ width: "70%" }}>
              <SelectSearch
                options={categories}
                filterOptions={fuzzySearch}
                value={category}
                placeholder="Selecciona una categoría"
                onChange={(e) => onChangeCategory(e)}
                search
              />
            </div>
          </div>

          <div
          className="popup-content-class"
   
          >
            <div style={{ width: "30%" }}>
              <h3>Etiquetas</h3>
            </div>
            <div style={{ width: "70%" }}>
              <SelectSearch
                options={tagsOp}
                filterOptions={fuzzySearch}
                value={tag}
                placeholder="Selecciona un tag"
                onChange={(e) => onChangeTag(e)}
                search
              />
              <div
                style={{
                  width: "80%",
                  marginLeft: "50px",
                  marginTop: "5px",
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
                
              >
                {tag?.map((t) => (
                  <p
                    onClick={() => removeTag(t)}
                    className="tags-p gray-button"
                  >
                    {t}
                    <i
                      style={{ marginLeft: "5px", color: "darkgray" }}
                      className="fas fa-times"
                    />
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ededed",
              margin: "20px auto",
              fontSize: "14px",
            }}
          >
            <div style={{ width: "30%" }}>
              <h3>Idioma</h3>
            </div>
            <div style={{ width: "70%" }}>
              <input
                onChange={(e) => setIdiom(e.target.value)}
                className="popupeditinfo-input"
                type="text"
                placeholder={idiom}
              />
            </div>
          </div>

          {/* Nuevo: Subir imagen */}
            
          <div className="popup-field">
          <div className="popup-content-class">
            <div style={{ width: "30%" }}>
              <h3>Subir imagen</h3>
            </div>
            <div style={{ width: "70%" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </div>
          </div>
          </div>


          {/* Nuevo: Checkbox para thumbnail permanente */}
          <div className="popup-field">
          <div className="popup-content-class">
            <div style={{ width: "30%" }}>
              <h3>Thumbnail Permanente</h3>
            </div>
            <div style={{ width: "70%" }}>
              <input
                type="checkbox"
                checked={thumbnailPermanent}
                onChange={(e) => setThumbnailPermanent(e.target.checked)}
              />{" "}
              Usar thumbnail permanente
            </div>
          </div>
          </div>
          <div className="popup-content-class">
  <div style={{ width: "30%" }}>
    <h3>Opciones de visualización</h3>
  </div>
  <div style={{ width: "70%" }}>
    <div>
      <label
     className="popup-content-class-label"
      >
        <input
          type="checkbox"
          value="pinkker_prime"
          checked={!!authorizationToView["pinkker_prime"]}
          onChange={(e) => handleAuthorizationChange(e.target.value, e.target.checked)}
        />
        Pinkker Prime
      </label>
    </div>
    <div>
      <label
     className="popup-content-class-label"
      >
        <input
          type="checkbox"
          value="subscription"
          checked={!!authorizationToView["subscription"]}
          onChange={(e) => handleAuthorizationChange(e.target.value, e.target.checked)}
        />
        Subscription
      </label>
    </div>
  </div>
</div>


          <div className="popup-new-container-button">
            <button
              className="popupeditinfo-button-cancel gray-button"
              onClick={closePopup}
            >
              Cancelar
            </button>
            <button
              className="popupeditinfo-button-confirm pink-button"
              onClick={() => handleSubmit()}
            >
              Confirmar
            </button>
          </div>
        </div>
      );
    } else {
    }
  }

  return (
    <div className="popup-body">
      <div className={"popup-container"}>
        <div className="popup-close">
          <button className="pinkker-button-more" onClick={closePopup}>
            <i className="fas fa-times" />
          </button>
        </div>

        <h3
          style={{ color: "darkgray", marginBottom: "30px", fontSize: "24px" }}
        >
          Editar información de la transmisión
        </h3>

        {getInfo()}
      </div>
    </div>
  );
}
