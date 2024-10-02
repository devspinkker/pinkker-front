import React, { useState, useEffect } from "react";
import { getTrends, getTrendsByPrefix } from "../../services/backGo/tweet";
import FollowCard from "./FollowCard";
import { Link } from "react-router-dom";
import { GetRecommendedUsers } from "../../services/backGo/user";

export default function Tendency() {
  const [trends, setTrends] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userFollows, setuserFollows] = useState(null);
  let token = window.localStorage.getItem("token");

  const UserFollowsFunc = async (e) => {
    const ExcludeIDs = [];
    const res = await GetRecommendedUsers(token, ExcludeIDs);
    console.log(res);

    if (res.message === "ok" && res.data) {
      console.log(res.data);
      setuserFollows(res.data);
    }
  };
  useEffect(() => {
    UserFollowsFunc();
  }, []);

  const handleInputChange = async (e) => {
    const prefix = e.target.value.trim();
    setInputValue(prefix);
    if (prefix) {
      try {
        const response = await getTrendsByPrefix(prefix);
        if (response.message == "ok" && response.data) {
          setTrends(response.data);
        } else {
          setTrends([]);
        }
      } catch (error) {
        console.error("Error fetching trends by prefix:", error);
        setTrends([]);
      }
    } else {
      fetchTrends();
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await getTrends();
      if (response.message == "ok" && response.data) {
        setTrends(response.data);
      } else {
        setTrends([]);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
      setTrends([]);
    }
  };

  // Fetch trends when the component mounts
  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="muro-tweet-secondary">
      <div
        style={{
          backgroundColor: "#3a3b3c",
          width: "92% !important",
          display: "flex",
          alignItems: "center",
          height: "40px",
          padding: "0px 10px",
          borderRadius: "5px",
        }}
      >
        <img
          src="/images/search.svg"
          style={{
            fontSize: "16px",
            color: "rgb(89 89 89)",
            margin: "8px",
          }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Buscar en el muro.."
        />
      </div>

      <div className="muro-tweet-secondary-tendency">
        <h3>{inputValue.length === 0 ? "Tendencias" : "hashtag"}</h3>
        {trends.map((trend, index) => (
          <div key={index} className="muro-tweet-secondary-tendency-card">
            <div>
              {inputValue.length === 0 && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "darkgray",
                    marginBottom: "3px",
                  }}
                >
                  Tendencias {index + 1}
                </p>
              )}
              <Link to={`/hashtag/${trend.hashtag}`}>
                <h3
                  style={{
                    color: "#f36196",
                    textShadow: "rgb(0, 0, 0) 0px 1px 0px",
                  }}
                >
                  #{trend.hashtag}
                </h3>
              </Link>
              <p
                style={{
                  fontSize: "13px",
                  color: "darkgray",
                  marginTop: "3px",
                }}
              >
                {trend.count} Posteos
              </p>
            </div>
            <div>
              <i
                style={{ fontSize: "13px", color: "darkgray" }}
                className="fas fa-ellipsis-h"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="muro-tweet-secondary-follow">
        <div>
          <h3>A quien seguir</h3>
          {userFollows &&
            userFollows.map((follow) => <FollowCard followData={follow} />)}
        </div>
      </div>
    </div>
  );
}
