import React, { useState, useEffect } from "react";
import "./PopUpSearch.css"; // Asegúrate de crear un archivo de estilos adecuado
import { SearchUser } from "../../services/backGo/user";
import Loader from "react-loader-spinner";

export default function PopUpSearch({ onClose, handleUserSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setUsers([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUserByName(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  async function searchUserByName(nameUser) {
    setLoading(true);
    try {
      const res = await SearchUser(nameUser);
      let response = res.data;
      if (response.message === "ok" && response?.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h4>Nuevo Mensaje</h4>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="search-container-popUpSearch">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && (
            <Loader
              type="TailSpin"
              color="#ff60b2"
              height={20}
              width={20}
              className="loader"
            />
          )}
        </div>
        <div className="users-list">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => handleUserSelect(user.id)}
              >
                <img src={user.Avatar} alt={user.NameUser} className="avatar" />
                <div className="user-iten-names">
                  <p>{"@" + user.NameUser}</p>
                  <p>{user.FullName}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron usuarios</p>
          )}
        </div>
      </div>
    </div>
  );
}
