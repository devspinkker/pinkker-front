import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "./Advertisements.css";
import {
  GetAdvertisements,
  CreateAdvertisement,
  UpdateAdvertisement,
  DeleteAdvertisement,
  GetAdsUserCode,
  GetAllPendingAds,
  AcceptPendingAds,
  RemovePendingAds,
  GetAdsUserPendingCode,
} from "../../services/backGo/advertisements";

export default function Advertisements({ Code }) {
  const [advertisements, setAdvertisements] = useState([]);
  const [pendingAds, setPendingAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [searchNameUser, setSearchNameUser] = useState("");
  const [showPending, setShowPending] = useState(false);

  const [form, setForm] = useState({
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

  const token = window.localStorage.getItem("token");

  const handleGetAdvertisements = async (page = 1) => {
    if (token) {
      const res = await GetAdvertisements(token, Code, page);
      if (res.message === "ok" && Array.isArray(res.data)) {
        setAdvertisements((prevAds) => [...prevAds, ...res.data]);
        setCurrentIndex(0);
      } else {
        console.error("Failed to fetch advertisements", res);
      }
    }
  };

  const handleGetPendingAds = async () => {
    if (token) {
      const res = await GetAllPendingAds(token, Code);
      if (res.message === "ok" && Array.isArray(res.data)) {
        setPendingAds(res.data);
      } else {
        console.error("Failed to fetch pending ads", res);
      }
    }
  };

  const handleSearchByUser = async () => {
    if (token && searchNameUser) {
      const res = await GetAdsUserCode(token, Code, searchNameUser);
      if (res.message === "ok" && Array.isArray(res.data)) {
        setAdvertisements(res.data);
        setCurrentIndex(0);
        setShowPending(false); // Asegúrate de mostrar solo anuncios activos
      } else {
        console.error("Failed to search advertisements", res);
      }
    }
  };

  const handleSearchPendingByUser = async () => {
    if (token && searchNameUser) {
      const res = await GetAdsUserPendingCode(token, Code, searchNameUser);
      if (res.message === "ok" && Array.isArray(res.data)) {
        setPendingAds(res.data);
        setShowPending(true); // Asegúrate de mostrar solo anuncios pendientes
      } else {
        console.error("Failed to search pending ads", res);
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
        setShowForm(false);
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

  const handleAcceptPending = async (name) => {
    if (token) {
      const res = await AcceptPendingAds(token, Code, name);
      if (res.message === "ok") {
        handleGetPendingAds();
      } else {
        console.error("Failed to accept pending advertisement", res);
      }
    }
  };

  const handleRejectPending = async (name) => {
    if (token) {
      const res = await RemovePendingAds(token, Code, name);
      if (res.message === "ok") {
        handleGetPendingAds();
      } else {
        console.error("Failed to reject pending advertisement", res);
      }
    }
  };

  useEffect(() => {
    if (!showPending) {
      handleGetAdvertisements();
    }
  }, [showPending]);

  useEffect(() => {
    if (showPending) {
      handleGetPendingAds();
    }
  }, [showPending]);

  useEffect(() => {
    if (currentIndex >= advertisements.length - 2) {
      handleGetAdvertisements();
    }
  }, [currentIndex]);

  const handleEdit = (ad) => {
    setForm(ad);
    setShowForm(true);
  };

  const handleNext = () => {
    if (currentIndex < advertisements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const transformDataForChart = (ad, metric) => {
    const data = [["Day", metric]];
    const dailyData =
      metric === "Clicks" ? ad.ClicksPerDay : ad.ImpressionsPerDay;

    dailyData.forEach((entry) => {
      const date = new Date(entry.Date);
      const count = metric === "Clicks" ? entry.Clicks : entry.Impressions;
      data.push([date.toDateString(), count]);
    });

    return data;
  };

  const getChartOptions = (metric) => ({
    title: `${metric} per Day`,
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: { title: "Date" },
    vAxis: { title: metric },
  });

  return (
    <div className="advertisement">
      {showForm && (
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
        </div>
      )}

      <div className="search-container-advertisement">
        <input
          type="text"
          placeholder="Search by NameUser"
          value={searchNameUser}
          onChange={(e) => setSearchNameUser(e.target.value)}
        />
        <button onClick={handleSearchByUser}>Search Active </button>
        <button onClick={handleSearchPendingByUser}>Search Pending</button>
      </div>

      <button onClick={() => setShowPending(!showPending)}>
        {showPending ? "Show Active Ads" : "Show Pending Ads"}
      </button>

      {showPending ? (
        <div className="pending-ads">
          {pendingAds.length > 0 ? (
            <div className="pending-ads-list">
              {pendingAds.map((ad) => (
                <div key={ad.id} className="ad-item">
                  <div className="ad-details">
                    <h3>{ad.Name}</h3>
                    <p>NameUser: {ad.NameUser}</p>
                    <p>Destination: {ad.Destination}</p>
                    <p>Categorie: {ad.Categorie}</p>
                    <p>UrlVideo: {ad.UrlVideo}</p>
                    <p>ReferenceLink: {ad.ReferenceLink}</p>
                    <p>ImpressionsMax: {ad.ImpressionsMax}</p>
                    <p>ClicksMax: {ad.ClicksMax}</p>
                    <p>DocumentToBeAnnounced: {ad.DocumentToBeAnnounced}</p>
                  </div>
                  <button
                    onDoubleClick={() => handleAcceptPending(ad.NameUser)}
                  >
                    Accept
                  </button>
                  <button
                    onDoubleClick={() => handleRejectPending(ad.NameUser)}
                  >
                    Reject
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No pending ads available.</p>
          )}
        </div>
      ) : (
        <div className="advertisements">
          {advertisements.length > 0 && (
            <div className="ad-slider">
              <button onClick={handlePrevious} className="slider-btn">
                Previous
              </button>
              <button onClick={handleNext} className="slider-btn">
                Next
              </button>
              <div className="ad-item">
                <h2>{advertisements[currentIndex]?.Name}</h2>
                <p>NameUser: {advertisements[currentIndex]?.NameUser}</p>
                <p>Destination: {advertisements[currentIndex]?.Destination}</p>
                <p>Categorie: {advertisements[currentIndex]?.Categorie}</p>
                <p>UrlVideo: {advertisements[currentIndex]?.UrlVideo}</p>
                <p>
                  ReferenceLink: {advertisements[currentIndex]?.ReferenceLink}
                </p>
                <p>
                  ImpressionsMax: {advertisements[currentIndex]?.ImpressionsMax}
                </p>
                <p>ClicksMax: {advertisements[currentIndex]?.ClicksMax}</p>
                <p>
                  DocumentToBeAnnounced:{" "}
                  {advertisements[currentIndex]?.DocumentToBeAnnounced}
                </p>
                <button
                  onDoubleClick={() => handleEdit(advertisements[currentIndex])}
                >
                  Edit
                </button>
                <button
                  onDoubleClick={() =>
                    handleDelete(advertisements[currentIndex]?.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
