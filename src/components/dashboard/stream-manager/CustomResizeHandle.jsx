import React from 'react'
import { IoResizeOutline } from 'react-icons/io5'

function CustomResizeHandle({ handleAxis }) {
  return (
    <span
    className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
    data-handle={handleAxis} // IMPORTANTE para la funcionalidad
    style={{
      position: "absolute",
      bottom: handleAxis === "s" ? "-10px" : "auto",
      top: handleAxis === "n" ? "-10px" : "auto",
      left: "50%",
      transform: "translateX(-50%)",
      cursor: "ns-resize",
      color: "red", // Cambia el color del icono
      fontSize: "20px",
      zIndex: 10, // Asegura que esté por encima
    }}
  >
    <IoResizeOutline />
  </span>
  )
}

export default CustomResizeHandle