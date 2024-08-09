import React from 'react';
import Modal from 'react-modal';
import '../App.css'
const RankingModal = ({ isOpen, onClose, userRank, rankings, isLoadingRankings }) => {
  return (
    <div className='bg-white border-red-200 border-t-'>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Ranking Modal"
        className="Modal"
        overlayClassName="Overlay"
      >

        {isLoadingRankings ? (
          <p>Calculating rankings...</p>
        ) : (
          <>
            <h3>Your Rank: {userRank}</h3>
            <h2>Top 5</h2>

            <ul>
              {rankings.map((ranking, index) => (
                <li key={index}>
                  {index + 1} <span className="ranks">{ranking.time / 1000}s</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </Modal>

    </div >

  );
};

export default RankingModal;
