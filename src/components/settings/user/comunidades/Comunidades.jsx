import React, { useEffect, useState } from "react";
import AnunciosComunidad from "./AnunciosComunidad ";
import { GetAllPendingNameUserAds } from "../../../../services/backGo/advertisements";

const Comunidades = () => {
  const [comunidades, setComunidades] = useState([]); // Aquí irán las comunidades del usuario
  const [anuncios, setAnuncios] = useState([]); // Anuncios de la comunidad seleccionada
  const [page, setPage] = useState(1);
  const token = window.localStorage.getItem("token");

  // Función para seleccionar una comunidad y cargar sus anuncios
  const handleSelectComunidad = async () => {
    if (token) {
      const res = await GetAllPendingNameUserAds(token, page);
      if (res.data) {
        console.log(res.data);

        setAnuncios(res.data);
      }
    }
  };
  useEffect(() => {
    handleSelectComunidad();
  }, []);
  return (
    <div>
      {/* Sección de comunidades */}
      <div>
        <h2>Mis Comunidades</h2>
        {comunidades.length > 0 ? (
          <ul>
            {comunidades.map((comunidad, index) => (
              <li key={index} onClick={() => handleSelectComunidad(comunidad)}>
                {comunidad.communityName}{" "}
                {/* Aquí puedes mostrar el nombre de la comunidad */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes comunidades aún.</p>
        )}
      </div>

      {/* Sección de anuncios de la comunidad seleccionada */}
      <div>
        <AnunciosComunidad anuncios={anuncios} />
      </div>
    </div>
  );
};

export default Comunidades;
