import React, { useState, useEffect } from "react";
import "./StreamSummaryAnalytics.css";
import { GetLastSixStreamSummaries } from "../../../services/backGo/streams";

export default function StreamSummaryAnalytics() {
  const [streamSummaries, setStreamSummaries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const date = new Date();
        const res = await GetLastSixStreamSummaries(token, date);

        if (res && res.data && res.data.length > 0) {
          setStreamSummaries(res.data);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching stream summaries:", error);
      }
    };

    fetchData();
  }, []);

  const navigatePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const navigateNext = () => {
    if (currentIndex < streamSummaries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const lastSummary = streamSummaries[streamSummaries.length - 1];
      const token = localStorage.getItem("token");
      const date = new Date(lastSummary.StartOfStream);
      fetchMoreStreamSummaries(token, date);
    }
  };

  const fetchMoreStreamSummaries = async (token, date) => {
    try {
      const res = await GetLastSixStreamSummaries(token, date);
      if (res && res.data && res.data.length > 0) {
        setStreamSummaries((prevSummaries) => [...prevSummaries, ...res.data]);
      }
    } catch (error) {
      console.error("Error fetching more stream summaries:", error);
    }
  };

  const renderSummary = (summary) => {
    if (!summary) return null;

    return (
      <div className="summary">
        <div className="summary-details">
          {Object.entries(summary).map(([key, value]) => {
            if (
              key === "id" ||
              key === "StreamerID" ||
              key === "EndOfStream" ||
              key === "StartOfStream"
            ) {
              return null;
            }

            return (
              <div className="summary-details-item" key={key}>
                <div className="property-name">
                  <span>{key}</span>

                  <span className="comparison">
                    {getComparisonValue(summary, key)}
                  </span>
                </div>

                <div className="property-value">
                  <span>{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getComparisonValue = (summary, key) => {
    const nextSummary = streamSummaries[currentIndex + 1];
    if (!nextSummary || key === "EndOfStream" || key === "StartOfStream")
      return null;
    const difference = nextSummary[key] - summary[key];
    return (difference > 0 ? "+" : "") + difference;
  };

  return (
    <div className="analytics">
      <div className="summary-container">
        <div className="summary-header">
          <div className="navigation">
            <span className="navigation-arrow" onClick={navigatePrevious}>
              {"<"}
            </span>
          </div>
          <h3>
            {streamSummaries[currentIndex]?.StartOfStream
              ? new Date(
                  streamSummaries[currentIndex].StartOfStream
                ).toLocaleDateString()
              : ""}
          </h3>
          <div className="navigation">
            <span className="navigation-arrow" onClick={navigateNext}>
              {">"}
            </span>
          </div>
        </div>
        {renderSummary(streamSummaries[currentIndex])}
      </div>
    </div>
  );
}
