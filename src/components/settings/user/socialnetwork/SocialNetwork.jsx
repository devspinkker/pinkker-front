import React, { useState, useEffect } from "react";
import "./SocialNetwork.css";
import {
  EditSocialNetworks,
  editProfile,
} from "../../../../services/backGo/user";
import { useNotification } from "../../../Notifications/NotificationProvider";

export default function SocialNetwork({ user }) {
  const [socialNetworks, setSocialNetworks] = useState({
    instagram: user?.socialnetwork?.instagram || "",
    tiktok: user?.socialnetwork?.tiktok || "",
    facebook: user?.socialnetwork?.facebook || "",
    twitter: user?.socialnetwork?.twitter || "",
    youtube: user?.socialnetwork?.youtube || "",
  });

  const alert = useNotification();

  useEffect(() => {
    if (user && user.socialnetwork) {
      setSocialNetworks({
        instagram: user.socialnetwork.instagram || "",
        tiktok: user.socialnetwork.tiktok || "",
        facebook: user.socialnetwork.facebook || "",
        twitter: user.socialnetwork.twitter || "",
        youtube: user.socialnetwork.youtube || "",
      });
    }
  }, [user]);

  async function handleSubmit() {
    try {
      const token = window.localStorage.getItem("token");
      console.log(socialNetworks);
      const data = await EditSocialNetworks(token, socialNetworks);

      alert({ type: "SUCCESS", message: data.message });
    } catch (error) {
      alert({ type: "ERROR", message: error.message });
    }
  }

  function handleChange(event, network) {
    setSocialNetworks({
      ...socialNetworks,
      [network]: event.target.value,
    });
  }

  return (
    <div className="socialnetwork-body">
      <div className="socialnetwork-body-conteiner">
        <div className="border-b-2 border-secondary-lighter px-4 py-2 font-semibold">
          Redes sociales
        </div>
        <div className="p-4 pt-3.5 text-sm">
          {Object.entries(socialNetworks).map(([network, value]) => (
            <div className="content-redes" key={network}>
              <label className="mb-1 font-semibold capitalize">{network}</label>
              <div className="red-input">
                <div className="red-config">{`${network}.com/`}</div>
                <input
                  value={value}
                  onChange={(e) => handleChange(e, network)}
                  className="user-red"
                  spellCheck="false"
                  type="text"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="button-content-social">
          <button
            onClick={handleSubmit}
            className="variant-highlight size-md base-button w-[111px]"
            type="button"
          >
            <div className="button-content">
              <div className="inner-label">Guardar</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
