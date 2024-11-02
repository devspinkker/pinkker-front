import React, { useState } from "react";
import "./ExploreCategories.css";
import { CiSliderVertical } from "react-icons/ci";
export default function CustomSelect({ options, defaultValue, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleOptionClick = (option) => {
    setSelectedValue(option);
    onChange && onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="custom-select-container"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2e38"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#121418"}
      >
        <div className="custom-select-header">
          <CiSliderVertical />
          <span>Ordenar por: </span>
          <span style={{ color: "#f36196" }}>{selectedValue}</span>
          <i
            className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
            style={{ marginLeft: "5px" }}
          ></i>
        </div>
      </div>
      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <span
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`custom-select-option ${
                option === selectedValue ? "selected" : ""
              }`}
            >
              {option}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
