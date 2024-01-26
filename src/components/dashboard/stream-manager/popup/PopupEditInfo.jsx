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

  useEffect(() => {
    console.log(stream);
    console.log(user);
    setTitle(stream?.stream_title);
    setNotification(stream?.stream_notification);
    setCategory(stream?.stream_category);
    setTag(stream?.stream_tag);
    setIdiom(stream?.stream_idiom);
    async function fetchData() {
      const res = await getCategoriesWithLimit();
      if (res.data != null && res.message == "ok") {
        const s = [];
        console.log(res);
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
    const dataSendUpdata = {
      title,
      notification,
      category,
      tag,
      idiom,
      keyTransmission: user.keyTransmission,
    };
    const data = await updateStreamInfo(token, dataSendUpdata);
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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ededed",
              fontSize: "14px",
            }}
          >
            <div style={{ width: "30%" }}>
              <h3>Titulo</h3>
            </div>

            <div style={{ width: "70%" }}>
              <input
                maxLength={30}
                onChange={(e) => setTitle(e.target.value)}
                defaultValue={title}
                className="popupeditinfo-input"
                type="text"
                placeholder="Introduce un titulo"
              />
              <div
                style={{
                  textAlign: "right",
                  marginTop: "5px",
                  marginRight: "7px",
                }}
              >
                <p style={{ fontSize: "13px", color: "lightgray" }}>
                  te quedan{" "}
                  <a style={{ color: "#ff60b2" }}>
                    {30 - title?.length} caracteres.
                  </a>
                </p>
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
              <h3>Notificación de emisión en directo</h3>
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
                  te quedan{" "}
                  <a style={{ color: "#ff60b2" }}>
                    {30 - notification?.length} caracteres.
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ededed",
              margin: "40px auto",
              fontSize: "14px",
            }}
          >
            <div style={{ width: "30%" }}>
              <h3>Categoría</h3>
            </div>

            <div style={{ width: "70%" }}>
              <SelectSearch
                options={categories && categories}
                filterOptions={fuzzySearch}
                value={category}
                placeholder="Selecciona una categoría"
                onChange={(e) => onChangeCategory(e)}
                search
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ededed",
              margin: "40px auto",
              fontSize: "14px",
            }}
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
                      class="fas fa-times"
                    />
                  </p>
                ))}
              </div>

              <p
                style={{
                  width: "80%",
                  marginLeft: "50px",
                  fontSize: "12px",
                  color: "darkgray",
                  marginTop: "5px",
                }}
              >
                Las etiquetas son detalles que se comparten en público sobre tu
                contenido que permiten que te descubran con más facilidad.
              </p>
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
              <h3>Idioma de la transmisión</h3>
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
            <i class="fas fa-times" />
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
