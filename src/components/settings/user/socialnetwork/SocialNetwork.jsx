import React, { useState, useEffect } from "react";

import "./SocialNetwork.css";
import { useSelector } from "react-redux";

import { updateSocialnetwork } from "../../../../services/user";

import { useNotification } from "../../../Notifications/NotificationProvider";
import { editAvatar, editProfile } from "../../../../services/backGo/user";

export default function SocialNetwork() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [instagram, setInstagram] = useState(null);
  const [tiktok, setTiktok] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [youtube, setYoutube] = useState(null);

  const alert = useNotification();

  useEffect(() => {
    if (user != null && user != undefined && user != []) {
      setInstagram(user.instagram);
      setTiktok(user.tiktok);
      setFacebook(user.facebook);
      setTwitter(user.twitter);
      setYoutube(user.youtube);
    }
  }, [user]);

  async function handleSubmit() {
    let token = window.localStorage.getItem("token");
    const data = await editProfile(token, {
      facebook,
      twitter,
      instagram,
      tiktok,
      youtube,
    });
    console.log(data);
    if (data != null && data != undefined && data.status == 200) {
      alert({ type: "SUCCESS", message: data.message });
    } else {
      alert({ type: "ERROR", message: data.message });
    }
  }

  function getType() {
    return (
      <div className="socialnetwork-container">
        <hr style={{ border: "1px solid #2b2b2b8f" }} />
        <div className="socialnetwork-content">
          <div
            style={{
              width: "145px",
              textAlign: "center",
              marginLeft: "20px",
              padding: "10px",
              backgroundColor: "#202020",
              borderTopLeftRadius: "5px",
              borderEndStartRadius: "5px",
            }}
          >
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <i style={{ marginRight: "5px" }} class="fab fa-instagram" />{" "}
              instagram.com/
            </h5>
          </div>
          <div className="socialnetwork-input">
            <input
              placeholder={user.socialnetwork.instagram}
              type="text"
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
        </div>

        <div className="socialnetwork-content">
          <div
            style={{
              width: "145px",
              textAlign: "center",
              marginLeft: "20px",
              padding: "10px",
              backgroundColor: "#202020",
              borderTopLeftRadius: "5px",
              borderEndStartRadius: "5px",
            }}
          >
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "70%",
              }}
            >
              <i style={{ marginRight: "5px" }} class="fab fa-tiktok" />{" "}
              tiktok.com/@
            </h5>
          </div>
          <div className="socialnetwork-input">
            <input
              placeholder={user.socialnetwork.tiktok}
              type="text"
              onChange={(e) => setTiktok(e.target.value)}
            />
          </div>
        </div>

        <div className="socialnetwork-content">
          <div
            style={{
              width: "145px",
              textAlign: "center",
              marginLeft: "20px",
              padding: "10px",
              backgroundColor: "#202020",
              borderTopLeftRadius: "5px",
              borderEndStartRadius: "5px",
            }}
          >
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "78%",
              }}
            >
              <i style={{ marginRight: "5px" }} class="fab fa-facebook" />{" "}
              facebook.com/
            </h5>
          </div>
          <div className="socialnetwork-input">
            <input
              placeholder={user.socialnetwork.facebook}
              type="text"
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>
        </div>

        <div className="socialnetwork-content">
          <div
            style={{
              width: "145px",
              textAlign: "center",
              marginLeft: "20px",
              padding: "10px",
              backgroundColor: "#202020",
              borderTopLeftRadius: "5px",
              borderEndStartRadius: "5px",
            }}
          >
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "67%",
              }}
            >
              <i class="fab fa-twitter" /> twitter.com/
            </h5>
          </div>
          <div className="socialnetwork-input">
            <input
              placeholder={user.socialnetwork.twitter}
              type="text"
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
        </div>

        <div className="socialnetwork-content">
          <div
            style={{
              width: "145px",
              textAlign: "center",
              marginLeft: "20px",
              padding: "10px",
              backgroundColor: "#202020",
              borderTopLeftRadius: "5px",
              borderEndStartRadius: "5px",
            }}
          >
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "77%",
              }}
            >
              <i style={{ marginRight: "5px" }} class="fab fa-youtube" />{" "}
              youtube.com/
            </h5>
          </div>
          <div className="socialnetwork-input">
            <input
              placeholder={user.socialnetwork.youtube}
              type="text"
              onChange={(e) => setYoutube(e.target.value)}
            />
          </div>
        </div>

        <div style={{ textAlign: "right", padding: "20px" }}>
          <button
            style={{ width: "105px" }}
            onClick={() => handleSubmit()}
            className="biography-button pink-button"
          >
            Guardar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="socialnetwork-body">
      <h2>Redes sociales</h2>
      {user.socialnetwork && getType()}
    </div>
  );
}
