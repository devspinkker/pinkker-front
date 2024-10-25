import React, { useEffect, useState } from "react";
import {
  GetActiveAdsByEndAdCommunity,
  GetAdsByNameUser,
  GetAllAcceptedNameUserAds,
  GetAllPendingNameUserAds,
} from "../../../../services/backGo/advertisements";
import AnunciosComunidad from "./AnunciosComunidad";
import "./Comunidades.css";
import { FindUserCommunities } from "../../../../services/backGo/communities";
import ListCommunities from "../../../muro/communities/ListCommunities";
import CreateCommunityDialog from "../../../muro/communities/CreateCommunityDialog";

const Comunidades = () => {
  const [comunidades, setComunidades] = useState([]); // Comunidades del usuario
  const [anuncios, setAnuncios] = useState([]); // Anuncios de la comunidad seleccionada
  const [page, setPage] = useState(1); // Paginación
  const [section, setSection] = useState("comunidades"); // Sección seleccionada: comunidades o anuncios
  const [adSection, setAdSection] = useState("pending"); // Sección interna de anuncios
  const [name, setName] = useState(""); // Para buscar anuncios por nombre de usuario
  const token = window.localStorage.getItem("token");
  const UserId = window.localStorage.getItem("_id");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Función para cargar las comunidades del usuario
  const handleFindUserCommunities = async () => {
    if (UserId) {
      const res = await FindUserCommunities({ UserId });
      if (res.data) {
        setComunidades(res.data);
      }
    }
  };

  // Funciones para cargar anuncios según la sección
  const handleAllPendingNameUserAds = async () => {
    if (token) {
      const res = await GetAllPendingNameUserAds(token, page);
      if (res.data) {
        setAnuncios(res.data);
      } else {
        setAnuncios([]);
      }
    }
  };

  const handleGetAllAcceptedNameUserAds = async () => {
    if (token) {
      const res = await GetAllAcceptedNameUserAds(token, page);
      if (res.data) {
        setAnuncios(res.data);
      } else {
        setAnuncios([]);
      }
    }
  };

  const handleGetActiveAdsByEndAdCommunity = async () => {
    if (token) {
      const res = await GetActiveAdsByEndAdCommunity(token, page);
      if (res.data) {
        setAnuncios(res.data);
      } else {
        setAnuncios([]);
      }
    }
  };

  const handleGetAdsByNameUser = async () => {
    if (token && name) {
      const res = await GetAdsByNameUser(token, page, name);
      if (res.data) {
        setAnuncios(res.data);
      } else {
        setAnuncios([]);
      }
    }
  };

  // Cargar comunidades al inicio
  useEffect(() => {
    if (section === "comunidades") {
      handleFindUserCommunities();
    }
  }, [section, page]);

  // Cargar anuncios dependiendo de la sub-sección seleccionada
  useEffect(() => {
    if (section === "anuncios") {
      if (adSection === "pending") {
        handleAllPendingNameUserAds();
      } else if (adSection === "accepted") {
        handleGetAllAcceptedNameUserAds();
      } else if (adSection === "active") {
        handleGetActiveAdsByEndAdCommunity();
      } else if (adSection === "nameUser") {
        handleGetAdsByNameUser();
      }
    }
  }, [adSection, section, page]);
  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);
  return (
    <div className="Comunidades-owner-actions-container">
      <div className="Comunidades-owner-actions">
        {/* Botones para seleccionar la sección principal */}
        <div className="type-set-config">
          <div
            className="button-get-info-comunidades"
            onClick={() => setSection("comunidades")}
          >
            Comunidades
          </div>
          <div
            className="button-get-info-comunidades"
            onClick={() => setSection("anuncios")}
          >
            Anuncios
          </div>
          <div
            className="button-get-info-comunidades"
            onClick={() => {
              handleOpenCreateDialog();
              setSection("dialogo");
            }}
          >
            Crear comunidad
          </div>
        </div>

        {/* Sección de Comunidades */}
        {section === "comunidades" && (
          <div>
            <h2>Mis Comunidades</h2>
            {comunidades.length > 0 ? (
              <ListCommunities communities={comunidades} />
            ) : (
              <p>No tienes comunidades.</p>
            )}
          </div>
        )}

        {/* Sección de Anuncios */}
        {section === "anuncios" && (
          <div>
            {/* Sub-secciones de anuncios */}
            <div className="type-set-config">
              <div
                className="button-get-info-comunidades"
                onClick={() => setAdSection("pending")}
              >
                Anuncios Pendientes
              </div>
              <div
                className="button-get-info-comunidades"
                onClick={() => setAdSection("accepted")}
              >
                Anuncios Aceptados
              </div>
              <div
                className="button-get-info-comunidades"
                onClick={() => setAdSection("active")}
              >
                Anuncios Activos
              </div>
              <div
                className="button-get-info-comunidades"
                onClick={() => setAdSection("nameUser")}
              >
                Anuncios por Nombre de Usuario
              </div>
            </div>

            {adSection === "nameUser" && (
              <div>
                <input
                  type="text"
                  placeholder="Nombre de Usuario"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleGetAdsByNameUser}>
                  Buscar Anuncios
                </button>
              </div>
            )}

            <div>
              <AnunciosComunidad anuncios={anuncios} />
            </div>

            {/* Botones para paginación */}
            <div>
              <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>
                Página Anterior
              </button>
              <button onClick={() => setPage(page + 1)}>
                Página Siguiente
              </button>
            </div>
          </div>
        )}
        {section == "dialogo" && (
          <CreateCommunityDialog
            open={openCreateDialog}
            onClose={handleCloseCreateDialog}
            token={token}
          />
        )}
      </div>
    </div>
  );
};

export default Comunidades;
