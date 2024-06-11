import React from 'react';

const Comments = ({ video }) => {
  // Aquí puedes añadir la lógica para mostrar los comentarios del video
  return (
    <div>
      <h2>Comentarios</h2>
      {/* Aquí va la lógica para mostrar los comentarios */}
      <p>Comentarios del video {video.url}</p>
      {/* Aquí puedes añadir más contenido como animaciones */}
    </div>
  );
};

export default Comments;
