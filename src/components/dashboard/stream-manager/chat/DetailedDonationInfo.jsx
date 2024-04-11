import React from "react";

const DetailedDonationInfo = ({ donation, close }) => {
  // Lógica para mostrar la información detallada de la donación
  return (
    <div className="detailed-donation-info">
      <h2>Detalles de la Donación</h2>
      <p>
        <strong>Nombre del Donante:</strong> {donation?.FromUserInfo.NameUser}
      </p>
      <p>
        <strong>Monto de la Donación:</strong> {donation?.Pixeles}
      </p>
      {/* Agrega más detalles según sea necesario */}

      <button onClick={close}>Cerrar Detalles</button>
    </div>
  );
};

export default DetailedDonationInfo;
