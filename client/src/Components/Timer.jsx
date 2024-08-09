import React from 'react';
import '../App.css';

const Timer = ({ elapsedTime,isGameWon }) => {
  return (
    <div className="stopwatch">
      <h2 className='timer'>{elapsedTime.seconds}.{elapsedTime.milliseconds}s</h2>
      <form action="submit">
          {isGameWon()?<button type='submit'>Restart</button>:""}
      </form>
    </div>
  );
};

export default Timer;
