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
    Destination: "",
    Categorie: "",
    Impressions: 0,
    UrlVideo: "",
    ReferenceLink: "",
    ImpressionsMax: 0.0,
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
        name === "Impressions"
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
        Impressions: parseInt(form.Impressions),
        ImpressionsMax: parseFloat(form.ImpressionsMax),
      };
      const res = form.id
        ? await UpdateAdvertisement(token, adData)
        : await CreateAdvertisement(token, adData);
      if (res.message === "ok") {
        handleGetAdvertisements();
        setForm({
          id: "",
          Name: "",
          Destination: "",
          Categorie: "",
          Impressions: 0,
          UrlVideo: "",
          ReferenceLink: "",
          ImpressionsMax: 0.0,
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
          name="Destination"
          placeholder="Destination"
          value={form.Destination}
          onChange={handleInputChange}
        />
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
        <button type="button" onClick={handleCreateOrUpdate}>
          {form.id ? "Update" : "Create"}
        </button>
      </form>

      {advertisements.length > 0 ? (
        advertisements.map((ad) => (
          <div key={ad.id} className="advertisement">
            <h2>{ad.Name}</h2>
            <p>Category: {ad.Categorie}</p>
            <p>Destination: {ad.Destination}</p>
            <p>Impressions: {ad.Impressions}</p>
            <p>ImpressionsMax: {ad.ImpressionsMax}</p>
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
