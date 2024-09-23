import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BuyadCreate } from "../../../../../services/backGo/advertisements";
import { useNotification } from "../../../../Notifications/NotificationProvider";
import "./PurchaseBuyAds.css";

export default function PurchaseBuyAds() {
  const auth = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    id: "",
    Name: "",
    Destination: "Muro",
    Categorie: "",
    UrlVideo: "",
    ReferenceLink: "",
    ImpressionsMax: 0.0,
    ClicksMax: 0,
    DocumentToBeAnnounced: "",
    totp_code: "", // Add this field for TOTP code
  });

  const alert = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]:
          name === "ClicksMax"
            ? parseInt(value)
            : name === "ImpressionsMax"
            ? parseFloat(value)
            : value,
      };

      if (updatedForm.Destination === "Streams") {
        updatedForm.ClicksMax = 0;
      } else if (updatedForm.Destination === "Muro") {
        updatedForm.ImpressionsMax = 0;
      }

      return updatedForm;
    });
  };

  const handleCreate = async () => {
    if (token) {
      const adData = {
        ...form,
        ImpressionsMax: parseFloat(form.ImpressionsMax),
        ClicksMax: parseInt(form.ClicksMax),
      };
      const res = await BuyadCreate(token, adData); // Use the TOTP code
      if (res.message === "ok") {
        setForm({
          id: "",
          Name: "",
          Destination: "Muro",
          Categorie: "",
          UrlVideo: "",
          ReferenceLink: "",
          ImpressionsMax: 0.0,
          ClicksMax: 0,
          DocumentToBeAnnounced: "",
          totp_code: "", // Reset the TOTP code field
        });
        alert({
          type: "SUCCESS",
          message: "Advertisement created successfully.",
        });
      } else {
        console.error("Failed to create advertisement", res);
        alert({
          type: "ERROR",
          message: "Failed to create advertisement.",
        });
      }
    }
  };

  const calculateAvailablePixels = () => {
    let impressionsPixels = form.ImpressionsMax * 20;
    let clicksPixels = form.ClicksMax * 72;

    if (form.Destination === "Streams") {
      clicksPixels = 0;
    } else if (form.Destination === "Muro") {
      impressionsPixels = 0;
    }

    return {
      impressionsPixels,
      clicksPixels,
    };
  };

  const { impressionsPixels, clicksPixels } = calculateAvailablePixels();

  return (
    <div className="purchase-ads">
      <h2 className="title">Purchase Advertisement Packs</h2>
      <div className="create-ad-form">
        <form>
          <div className="form-group">
            <label htmlFor="Name">Name:</label>
            <input
              type="text"
              id="Name"
              name="Name"
              placeholder="Name"
              value={form.Name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="Destination">Destination:</label>
            <select
              id="Destination"
              name="Destination"
              value={form.Destination}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Muro">Muro</option>
              <option value="Streams">Streams</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="Categorie">Categorie:</label>
            <input
              type="text"
              id="Categorie"
              name="Categorie"
              placeholder="Categorie"
              value={form.Categorie}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="UrlVideo">UrlVideo:</label>
            <input
              type="text"
              id="UrlVideo"
              name="UrlVideo"
              placeholder="UrlVideo"
              value={form.UrlVideo}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ReferenceLink">ReferenceLink:</label>
            <input
              type="text"
              id="ReferenceLink"
              name="ReferenceLink"
              placeholder="ReferenceLink"
              value={form.ReferenceLink}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ImpressionsMax">ImpressionsMax:</label>
            <input
              type="number"
              step="0.01"
              id="ImpressionsMax"
              name="ImpressionsMax"
              placeholder="ImpressionsMax"
              value={form.ImpressionsMax}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ClicksMax">ClicksMax:</label>
            <input
              type="number"
              id="ClicksMax"
              name="ClicksMax"
              placeholder="ClicksMax"
              value={form.ClicksMax}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="DocumentToBeAnnounced">
              Document to be announced:
            </label>
            <input
              type="text"
              id="DocumentToBeAnnounced"
              name="DocumentToBeAnnounced"
              placeholder="Document to be announced"
              value={form.DocumentToBeAnnounced}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="totp_code">TOTP Code:</label>
            <input
              type="text"
              id="totp_code"
              name="totp_code"
              placeholder="Enter 6-digit TOTP code"
              value={form.totp_code}
              onChange={handleInputChange}
              className="form-input"
              maxLength="6"
              pattern="\d{6}"
              title="TOTP code must be 6 digits"
            />
          </div>
        </form>
      </div>

      <div className="ad-info">
        <p className="info-text">
          To create an advertisement, you have available pixels based on the
          following calculations:
        </p>
        <ul className="info-list">
          <li>
            Impressions: {form.ImpressionsMax} →{" "}
            <strong>{impressionsPixels} pixels</strong>
          </li>
          <li>
            Clicks: {form.ClicksMax} → <strong>{clicksPixels} pixels</strong>
          </li>
        </ul>
        <button type="button" onClick={handleCreate} className="create-btn">
          Create Advertisement
        </button>
      </div>
    </div>
  );
}
