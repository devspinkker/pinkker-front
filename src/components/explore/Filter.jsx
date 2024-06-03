// src/Filter.js
import React from 'react';

const Filter = ({ selectedFilter, onSelectFilter }) => {
  return (
    <div className="filter-container">
      <button
        className={selectedFilter === 'live' ? 'active' : ''}
        onClick={() => onSelectFilter('live')}
      >
        En Vivo
      </button>
      <button
        className={selectedFilter === 'clips' ? 'active' : ''}
        onClick={() => onSelectFilter('clips')}
      >
        Clips
      </button>
    </div>
  );
};

export default Filter;