import React from 'react';
import Cards from './Cards';
import '../App.css';

const CardGrid = ({ cards, onCardClick }) => {
  return (
    <div className="card-grid">
      {cards.map(card => (
        <Cards key={card.id} card={card} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardGrid;
