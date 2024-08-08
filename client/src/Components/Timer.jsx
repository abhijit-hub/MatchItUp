import React from 'react';
import '../App.css';

const Timer = ({ elapsedTime }) => {
  return (
    <div className="stopwatch">
      <h2 className='timer'>{elapsedTime.seconds}.{elapsedTime.milliseconds}s</h2>
    </div>
  );
};

export default Timer;
