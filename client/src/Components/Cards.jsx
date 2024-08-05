// src/components/Cards.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const Cards = ({ card, onClick }) => {
    return (
      <div className="card" onClick={() => onClick(card)}>
        {card.isFlipped ?<img className='imgClass' src={card.icon} alt="" />: ""}
      </div>
    );
  };
export default Cards;
