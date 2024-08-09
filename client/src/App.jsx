import React, { useState, useEffect, useRef } from 'react';
import Cards from './Components/Cards';
import './App.css';
import axios from 'axios';
import Modal from 'react-modal';
import { initialCardsone, initialCardstwo, initialCardsthree } from './cardData';
import RankingModal from './Components/RankingModal';
import Timer from './Components/Timer';
import DifficultyButtons from './Components/DifficultyButtons';
import { Analytics } from "@vercel/analytics/react"



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
    return []; 
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
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);


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
      setIsModalOpen(true);

    }
  }, [cards]);

  const handleChangeCount = (newCount, difficultyLevel) => {
    setCount(newCount);
    setDifficulty(difficultyLevel);
    setCards(getInitialCards(newCount));
    setFlippedCards([]);
    setStartTime(null);
    setElapsedTime({ seconds: 0, milliseconds: 0 });
    handleRestart();
  };
  const handleRestart = () => {
    
    setCards(getInitialCards(count));
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
    } finally {
      setIsLoadingRankings(false);

    }
  };

  useEffect(() => {
    fetchRankings();
  }, [difficulty]);

  return (
    <div className="App">
      <h1 className='heading'>Match It Up</h1>
      <DifficultyButtons handleChangeCount={handleChangeCount} />
      <div className="card-grid">
        {cards.map(card => (
          <Cards key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
      <Timer elapsedTime={elapsedTime} isGameWon={isGameWon} handleRestart={handleRestart}/>
      <RankingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userRank={userRank} rankings={rankings}  isLoadingRankings={isLoadingRankings} />
      <Analytics />
      <footer>Created by <a target='#' href="https://github.com/abhijit-hub">abhijit-hub</a></footer>
    </div>
  );
};

export default App;
