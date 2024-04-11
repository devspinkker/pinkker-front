import React, { useState, useEffect, useRef } from "react";
import "./DashBoardAjustes.css";
import SettingsStream from "../settings/stream/SettingsStream";

export default function DashboardServerTransmision({
  isMobile,
  tyExpanded,
  user,
}) {
  return (
    <div
      id="DashboardStream-container"
      style={{
        padding: !tyExpanded && "0rem 15rem",
        width: !tyExpanded && "96%",
      }}
    >
      <SettingsStream user={user} />
    </div>
  );
}
