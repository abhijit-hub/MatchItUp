import React from 'react';
import '../App.css';

const Timer = ({ elapsedTime,handleRestart }) => {
  return (
    <div className="stopwatch">
      <h2 className='timer'>{elapsedTime.seconds}.{elapsedTime.milliseconds}s</h2>
      <button className='restart-btn' onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default Timer;
