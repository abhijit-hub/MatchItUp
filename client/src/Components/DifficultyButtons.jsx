import React from 'react';
import '../App.css';

const DifficultyButtons = ({ handleChangeCount }) => {
  return (
    <div className='btn-div'>
      <button className='btn' onClick={() => handleChangeCount(8, 'Easy')}>Easy</button>
      <button className='btn' onClick={() => handleChangeCount(12, 'Medium')}>Medium</button>
      <button className='btn' onClick={() => handleChangeCount(16, 'Hard')}>Hard</button>
    </div>
  );
};

export default DifficultyButtons;
