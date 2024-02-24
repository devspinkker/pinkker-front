import React, { useState } from "react";
import "./ExploreCategories.css";
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
      >
        <div className="custom-select-header">
          <span>{selectedValue}</span>
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
