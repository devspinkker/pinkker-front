import React, { useState, useEffect } from "react";
import "./Advertisements.css";
import {
  GetAdvertisements,
  CreateAdvertisement,
  UpdateAdvertisement,
  DeleteAdvertisement,
} from "../../services/backGo/advertisements";

export default function Advertisements({ Code }) {
  const [advertisements, setAdvertisements] = useState([]);
  const [form, setForm] = useState({
    id: "",
    Name: "",
    NameUser: "",
    Destination: "Muro", // Valor por defecto
    Categorie: "",
    UrlVideo: "",
    ReferenceLink: "",
    ImpressionsMax: 0.0,
    ClicksMax: 0,
    DocumentToBeAnnounced: "000000000000000000000000",
    Code,
  });

  const token = window.localStorage.getItem("token");

  const handleGetAdvertisements = async () => {
    if (token) {
      const res = await GetAdvertisements(token, Code);
      if (res.message === "ok" && Array.isArray(res.data)) {
        setAdvertisements(res.data);
      } else {
        console.error("Failed to fetch advertisements", res);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "ClicksMax"
          ? parseInt(value)
          : name === "ImpressionsMax"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleCreateOrUpdate = async () => {
    if (token) {
      const adData = {
        ...form,
        Code,
        ImpressionsMax: parseFloat(form.ImpressionsMax),
        ClicksMax: parseInt(form.ClicksMax),
      };
      const res = form.id
        ? await UpdateAdvertisement(token, adData)
        : await CreateAdvertisement(token, adData);
      if (res.message === "ok") {
        handleGetAdvertisements();
        setForm({
          id: "",
          Name: "",
          NameUser: "",
          Destination: "Muro",
          Categorie: "",
          UrlVideo: "",
          ReferenceLink: "",
          ImpressionsMax: 0.0,
          ClicksMax: 0,
          DocumentToBeAnnounced: "",
          Code,
        });
      } else {
        console.error("Failed to create/update advertisement", res);
      }
    }
  };

  const handleDelete = async (id) => {
    if (token) {
      const res = await DeleteAdvertisement(token, id, Code);
      if (res.message === "ok") {
        handleGetAdvertisements();
      } else {
        console.error("Failed to delete advertisement", res);
      }
    }
  };

  useEffect(() => {
    handleGetAdvertisements();
  }, []);

  const handleEdit = (ad) => {
    setForm(ad);
  };

  return (
    <div className="update-categorie-container">
      <form className="advertisement-form">
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={form.Name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="NameUser"
          placeholder="NameUser"
          value={form.NameUser}
          onChange={handleInputChange}
        />
        <select
          name="Destination"
          value={form.Destination}
          onChange={handleInputChange}
        >
          <option value="Muro">Muro</option>
          <option value="Streams">Streams</option>
        </select>
        <input
          type="text"
          name="Categorie"
          placeholder="Categorie"
          value={form.Categorie}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="UrlVideo"
          placeholder="UrlVideo"
          value={form.UrlVideo}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ReferenceLink"
          placeholder="ReferenceLink"
          value={form.ReferenceLink}
          onChange={handleInputChange}
        />

        <input
          type="number"
          step="0.01"
          name="ImpressionsMax"
          placeholder="ImpressionsMax"
          value={form.ImpressionsMax}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="ClicksMax"
          placeholder="ClicksMax"
          value={form.ClicksMax}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="DocumentToBeAnnounced"
          placeholder="Document to be announced"
          value={form.DocumentToBeAnnounced}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleCreateOrUpdate}>
          {form.id ? "Update" : "Create"}
        </button>
      </form>

      {advertisements.length > 0 ? (
        advertisements.map((ad) => (
          <div key={ad.id} className="advertisement">
            <h2>{ad.Name}</h2>
            <p>NameUser: {ad.NameUser}</p>
            <p>Category: {ad.Categorie}</p>
            <p>Destination: {ad.Destination}</p>
            <p>Impressions: {ad.Impressions}</p>
            <p>ImpressionsMax: {ad.ImpressionsMax}</p>
            <p>Clicks: {ad.Clicks}</p>
            <p>ClicksMax: {ad.ClicksMax}</p>
            <p>Document to be announced: {ad.DocumentToBeAnnounced}</p>
            <a
              href={ad.ReferenceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reference Link
            </a>
            <video
              style={{ width: "100%", height: "auto" }}
              controls
              src={ad.UrlVideo}
            />
            <button onClick={() => handleEdit(ad)}>Edit</button>
            <button onClick={() => handleDelete(ad.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No advertisements found.</p>
      )}
    </div>
  );
}
