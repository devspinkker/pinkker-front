import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTweetsByHashtag } from "../../services/backGo/tweet";
import TweetCard from "./tweet/TweetCard";
import "./HashtagPost.css";
export default function HashtagPost() {
  const { hashtag } = useParams();
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetchTweetsByHashtag();
  }, [hashtag]);

  const fetchTweetsByHashtag = async () => {
    try {
      const response = await getTweetsByHashtag(hashtag);
      console.log(response);
      if (response.message == "ok" && response.data) {
        setTweets(response.data);
      } else {
        setTweets([]);
      }
    } catch (error) {
      console.error("Error fetching tweets by hashtag:", error);
      setTweets([]);
    }
  };

  return (
    <div className="hashtag-post-container">
      <div className="muro-tweet-container">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
