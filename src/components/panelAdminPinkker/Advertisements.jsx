import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import "./Advertisements.css";
import {
  GetAdvertisements,
  CreateAdvertisement,
  UpdateAdvertisement,
  DeleteAdvertisement,
  GetAdsUserCode,
} from "../../services/backGo/advertisements";

export default function Advertisements({ Code }) {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [searchNameUser, setSearchNameUser] = useState("");

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
    DocumentToBeAnnounced: "000000000000000000000000",
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

  const handleSearchByUser = async () => {
    if (token && searchNameUser) {
      const res = await GetAdsUserCode(token, Code, searchNameUser);
      if (res.message === "ok" && Array.isArray(res.data)) {
        console.log(res.data);

        setAdvertisements(res.data);
        setCurrentIndex(0);
      } else {
        console.error("Failed to search advertisements", res);
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

  useEffect(() => {
    handleGetAdvertisements();
  }, []);

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
      data.push([date, count]);
    });

    return data;
  };

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
            <button type="button" onDoubleClick={handleCreateOrUpdate}>
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
        <button onClick={handleSearchByUser}>Search</button>
      </div>

      <button onClick={() => setShowForm(true)} className="create-ad-btn">
        Create Advertisement
      </button>

      {advertisements.length > 0 ? (
        <div className="advertisementShow">
          <button onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </button>

          {advertisements[currentIndex] && (
            <div
              key={advertisements[currentIndex].id}
              className="advertisementIter"
            >
              <h2>{advertisements[currentIndex].Name}</h2>
              <p>NameUser: {advertisements[currentIndex].NameUser}</p>
              <p>Category: {advertisements[currentIndex].Categorie}</p>
              <p>Destination: {advertisements[currentIndex].Destination}</p>
              <p>Impressions: {advertisements[currentIndex].Impressions}</p>
              <p>
                ImpressionsMax: {advertisements[currentIndex].ImpressionsMax}
              </p>
              <p>Clicks: {advertisements[currentIndex].Clicks}</p>
              <p>ClicksMax: {advertisements[currentIndex].ClicksMax}</p>
              <p>
                Document to be announced:{" "}
                {advertisements[currentIndex].DocumentToBeAnnounced}
              </p>
              <a
                href={advertisements[currentIndex].ReferenceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reference Link
              </a>
              <div>
                {advertisements[currentIndex].Destination === "Muro" ? (
                  <Chart
                    width={"100%"}
                    height={"400px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart...</div>}
                    data={transformDataForChart(
                      advertisements[currentIndex],
                      "Clicks"
                    )}
                    options={{
                      title: "Clicks per Day",
                      hAxis: {
                        title: "Day",
                        format: "MMM dd",
                        textStyle: { color: "#fff" },
                      },
                      vAxis: { title: "Clicks", minValue: 0 },
                      series: {
                        0: { color: "#FF5733" },
                      },
                      chartArea: { width: "80%", height: "70%" },
                      backgroundColor: "transparent",
                    }}
                  />
                ) : (
                  <Chart
                    width={"100%"}
                    height={"400px"}
                    chartType="LineChart"
                    loader={<div>Loading Chart...</div>}
                    data={transformDataForChart(
                      advertisements[currentIndex],
                      "Impressions"
                    )}
                    options={{
                      title: "Impressions per Day",
                      hAxis: {
                        title: "Day",
                        format: "MMM dd",
                        textStyle: { color: "#fff" },
                      },
                      series: {
                        0: { color: "#FF5733" },
                      },
                      vAxis: { title: "Impressions", minValue: 0 },
                      chartArea: { width: "80%", height: "70%" },
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </div>
              <button onClick={() => handleEdit(advertisements[currentIndex])}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(advertisements[currentIndex].id)}
              >
                Delete
              </button>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={currentIndex === advertisements.length - 1}
          >
            Next
          </button>
        </div>
      ) : (
        <p>No advertisements found.</p>
      )}
    </div>
  );
}
