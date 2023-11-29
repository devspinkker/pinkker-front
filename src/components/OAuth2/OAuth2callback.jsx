import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Google_callback,
  Google_callback_Complete_Profile_And_Username,
  setToken,
} from "../../services/backGo/OAuth2";
import { toast } from "react-toastify";
import axios from "axios";
import "./OAuth2.css";

export default function OAuth2callback() {
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [username, setUsername] = useState("");
  const [biography, setBiography] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  useEffect(() => {
    // Obtener la lista de países de América Latina
    axios
      .get("https://restcountries.com/v2/region/americas")
      .then((response) => {
        const countryOptions = response.data.map((country) => ({
          value: country.alpha3Code,
          label: country.name,
        }));
        setCountries(countryOptions);
      })
      .catch((error) =>
        console.error("Error al obtener la lista de países:", error)
      );
  }, []);

  useEffect(() => {
    // Obtener la lista de provincias para el país seleccionado
    if (selectedCountry) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?country=${selectedCountry.label}&format=json`
        )
        .then((response) => {
          const provinceOptions = response.data.map((province) => ({
            value: province.display_name,
            label: province.display_name,
          }));
          setProvinces(provinceOptions);
        })
        .catch((error) =>
          console.error("Error al obtener la lista de provincias:", error)
        );
    }
  }, [selectedCountry]);
  const handleOAuthCallback = async (code) => {
    try {
      const responseGoogleCallback = await Google_callback(code);

      if (responseGoogleCallback.data.message === "redirect to complete user") {
        setEmail(responseGoogleCallback.data.data);

        setShowUsernameForm(true);
      }

      if (responseGoogleCallback.data.message === "token") {
        handleAuthenticatedUser(responseGoogleCallback.data);
      }
    } catch (error) {
      console.error("Error al manejar el callback de Google:", error);
    }
  };

  const handleUsernameFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        nameUser: username,
        email,
        pais: selectedCountry ? selectedCountry.label : "",
        ciudad: selectedProvince ? selectedProvince.label : "",
        biography: biography,
      };

      const response = await Google_callback_Complete_Profile_And_Username(
        userData
      );

      handleProfileCompletionResponse(response);
    } catch (error) {
      console.error("Error al completar el perfil:", error);
    }
  };

  const handleProfileCompletionResponse = (response) => {
    if (response.data.message === "token") {
      alert("Ñ");
      window.localStorage.setItem("token", response.data.data);
      window.localStorage.setItem("_id", response.data._id);
      window.localStorage.setItem("avatar", response.data.avatar);
      window.location.href = "/";
    } else {
      alert("Otro tipo de respuesta2");
    }
  };

  const handleAuthenticatedUser = (userData) => {
    alert("otra ñ");

    window.localStorage.setItem("token", userData.data);
    window.localStorage.setItem("_id", userData._id);
    window.localStorage.setItem("avatar", userData.avatar);
    window.location.href = "/";
  };

  return (
    <div>
      {showUsernameForm && (
        <div className="form-container">
          <form onSubmit={handleUsernameFormSubmit}>
            <label>
              nombre de usuario
              <input
                className="auth-contentOAuth2callback"
                placeholder="nameUser"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              País:
              <Select
                className="auth-contentOAuth2callback"
                options={countries}
                value={selectedCountry}
                onChange={(selectedOption) =>
                  setSelectedCountry(selectedOption)
                }
              />
            </label>
            <label>
              Provincia:
              <Select
                className="auth-contentOAuth2callback"
                options={provinces}
                value={selectedProvince}
                onChange={(selectedOption) =>
                  setSelectedProvince(selectedOption)
                }
              />
            </label>
            <label>
              Biografía:
              <textarea
                className="auth-contentOAuth2callback"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </label>
            <button type="submit">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}
