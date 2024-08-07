import React, { useState, useEffect, useRef } from 'react';
import Cards from './Components/Cards';
import './App.css';
import axios from 'axios';
import Modal from 'react-modal';
import { Analytics } from "@vercel/analytics/react"

const initialCardstwo = [
  { id: 1, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 2, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 3, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 4, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 5, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 6, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 7, symbol: 'D', isFlipped: false, icon: 'tech/JavaScript.svg' },
  { id: 8, symbol: 'D', isFlipped: false, icon: 'tech/JavaScript.svg' },
  { id: 9, symbol: 'F', isFlipped: false, icon: 'tech/Node.js.svg' },
  { id: 10, symbol: 'F', isFlipped: false, icon: 'tech/Node.js.svg' },
  { id: 11, symbol: 'G', isFlipped: false, icon: 'tech/Python.svg' },
  { id: 12, symbol: 'G', isFlipped: false, icon: 'tech/Python.svg' },

];

const initialCardsone = [
  { id: 1, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 2, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 3, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 4, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 5, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 6, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 7, symbol: 'H', isFlipped: false, icon: 'tech/C.svg' },
  { id: 8, symbol: 'H', isFlipped: false, icon: 'tech/C.svg' },
];

const initialCardsthree = [
  { id: 1, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 2, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 3, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 4, symbol: 'B', isFlipped: false, icon: 'tech/Figma.svg' },
  { id: 5, symbol: 'A', isFlipped: false, icon: 'tech/HTML5.svg' },
  { id: 6, symbol: 'C', isFlipped: false, icon: 'tech/React.svg' },
  { id: 7, symbol: 'D', isFlipped: false, icon: 'tech/JavaScript.svg' },
  { id: 8, symbol: 'D', isFlipped: false, icon: 'tech/JavaScript.svg' },
  { id: 9, symbol: 'E', isFlipped: false, icon: 'tech/MongoDB.svg' }, //
  { id: 10, symbol: 'E', isFlipped: false, icon: 'tech/MongoDB.svg' },
  { id: 11, symbol: 'F', isFlipped: false, icon: 'tech/Node.js.svg' },
  { id: 12, symbol: 'F', isFlipped: false, icon: 'tech/Node.js.svg' },
  { id: 13, symbol: 'G', isFlipped: false, icon: 'tech/Python.svg' },
  { id: 14, symbol: 'G', isFlipped: false, icon: 'tech/Python.svg' },
  { id: 15, symbol: 'H', isFlipped: false, icon: 'tech/C.svg' },
  { id: 16, symbol: 'H', isFlipped: false, icon: 'tech/C.svg' },



];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getInitialCards = (count) => {
  if (count === 8) {
    return shuffleArray([...initialCardsone]);
  } else if (count === 12) {
    return shuffleArray([...initialCardstwo]);
  } else if (count === 16) {
    return shuffleArray([...initialCardsthree]);
  } else {
    return []; // or some default value
  }
};
Modal.setAppElement('#root'); 

const App = () => {
  const [count, setCount] = useState(8);
  const [difficulty, setDifficulty] = useState('Easy');
  const [cards, setCards] = useState(() => getInitialCards(count));
  const [flippedCards, setFlippedCards] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({ seconds: 0, milliseconds: 0 });
  const timerRef = useRef(null);
  const [rankings, setRankings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (startTime !== null) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const seconds = Math.floor(elapsed / 1000);
        const milliseconds = Math.floor((elapsed % 1000) / 100); // two decimal places
        setElapsedTime({ seconds, milliseconds });
      }, 10); // Update every 10ms for better precision
      return () => clearInterval(timerRef.current);
    }
  }, [startTime]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length < 2 && !clickedCard.isFlipped) {
      if (startTime === null) {
        setStartTime(Date.now());
      }

      const newFlippedCards = [...flippedCards, clickedCard];
      setFlippedCards(newFlippedCards);

      const newCards = cards.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      );
      setCards(newCards);

      if (newFlippedCards.length === 2) {
        setTimeout(() => {
          if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
            setFlippedCards([]);
          } else {
            const resetCards = newCards.map(card =>
              card.id === newFlippedCards[0].id || card.id === newFlippedCards[1].id
                ? { ...card, isFlipped: false }
                : card
            );
            setCards(resetCards);
            setFlippedCards([]);
          }
        }, 500);
      }
    }
  };

  useEffect(() => {
    setCards(getInitialCards(count));
  }, [count]);

  useEffect(() => {
    if (isGameWon() && timerRef.current) {
      clearInterval(timerRef.current);
      saveRanking();
    }
  }, [cards]);

  const handleChangeCount = (newCount, difficultyLevel) => {
    setCount(newCount);
    setDifficulty(difficultyLevel);
    setCards(getInitialCards(newCount));
    setFlippedCards([]);
    setStartTime(null);
    setElapsedTime({ seconds: 0, milliseconds: 0 });
  };

  const isGameWon = () => {
    return cards.every(card => card.isFlipped);
  };

  const saveRanking = async () => {
    try {
      const time = elapsedTime.seconds * 1000 + elapsedTime.milliseconds * 10;
      await axios.post('https://matchitup-server.vercel.app/api/rankings', { time, level: difficulty });
      const response = await axios.post('https://matchitup-server.vercel.app/api/calculateRank', { time, level: difficulty });
      setUserRank(response.data.rank);
      fetchRankings();
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error saving ranking:', error);
    }
  };

  const fetchRankings = async () => {
    try {
      const response = await axios.get('https://matchitup-server.vercel.app/api/rankings', { params: { level: difficulty } });
      setRankings(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [difficulty]);

  return (
    <div className="App">
      <h1 className='heading'>Match It Up</h1>
        <div className='btn-div'>
          <button className='btn' onClick={() => handleChangeCount(8, 'Easy')}>Easy</button>
          <button className='btn' onClick={() => handleChangeCount(12, 'Medium')}>Medium</button>
          <button className='btn' onClick={() => handleChangeCount(16, 'Hard')}>Hard</button>
        </div>
        
      
      <div className="card-grid">
        {cards.map(card => (
          <Cards key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
      <div className="stopwatch">
        <h2 className='timer'>{elapsedTime.seconds}.{elapsedTime.milliseconds}s</h2>
        {isGameWon()?<form action="">
          <button typeof='submit'>Restart</button>
          
        </form>:""}
      </div>
      <div className='bg-white border-red-200 border-t-'>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Ranking Modal"
          className="Modal bg-red-500"
          overlayClassName="Overlay"
        >
          <h3>Your Rank: {userRank}</h3>
          <h2>Top 5</h2>
          <ul>
            {rankings.map((ranking, index) => (
              <li key={index}>
                {index + 1} <span className='ranks'>{ranking.time / 1000}s</span>
              </li>
            ))}
          </ul>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      </div>
      <Analytics />
    </div>
  );
};

export default App;
