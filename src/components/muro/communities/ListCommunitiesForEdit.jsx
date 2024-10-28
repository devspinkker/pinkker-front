import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import EditCommunityDialog from "./EditCommunityDialog";
import { useHistory } from "react-router-dom";
import "./Communities.css";

export default function ListCommunitiesForEdit({ community }) {
  const history = useHistory();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const token = window.localStorage.getItem("token");
  const handleCommunityClick = (communityName) => {
    history.push(`/plataform/communities/${communityName}`);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true); // Mostrar el diálogo de edición
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false); // Ocultar el diálogo de edición
  };

  return (
    <div className="communities-list">
      {community && (
        <div
          key={community.id}
          className="community-card"
          onClick={() => handleCommunityClick(community.id)}
          style={{ cursor: "pointer" }}
        >
          <div className="banner-container">
            <img
              src={
                community.Banner !== ""
                  ? community.Banner
                  : community.creatorDetails?.banner
              }
              alt="Community Banner"
              className="community-banner"
            />
          </div>
          <div className="community-name">
            <h4 className="community-title">{community.communityName}</h4>
          </div>
        </div>
      )}
      <Button onClick={handleEditClick}>Editar</Button>

      {isEditDialogOpen && (
        <EditCommunityDialog
          open={isEditDialogOpen}
          onClose={handleCloseDialog}
          token={token}
          CommunityId={community.id}
          CommunityName={community.communityName}
          Description={community.description}
          IsPrivate={community.isPrivate}
          Categories={community.categories[0]}
          IsPaid={community.IsPaid}
          SubscriptionAmount={community.SubscriptionAmount}
          AdPricePerDay={community.AdPricePerDay}
        />
      )}
    </div>
  );
}
