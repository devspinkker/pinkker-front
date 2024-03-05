import React, { useState, useEffect, useRef } from "react";
import "./DashBoardAjustes.css";
import UserSettings from "../../settings/user/UserSettings";

export default function DashboardAjustes({ isMobile, tyExpanded }) {
  return (
    <div
      id="DashboardStream-container"
      style={{
        padding: !tyExpanded && "0rem 4rem",
        width: !tyExpanded && "96%",
      }}
    >
      <UserSettings />
    </div>
  );
}
