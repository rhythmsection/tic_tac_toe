import React from 'react'
import GameSquare from './GameSquare.jsx'
import './GameBoard.css'

const GameBoard = ({ gameSquares, updateBoard, done, findBestMove, userChar }) => (
  <div className='gameBoard' style={{ pointerEvents: done ? 'none' : 'auto' }}>
    {gameSquares.map((char, idx) => {
      return (
        <GameSquare
          key={idx}
          id={idx}
          char={char}
          userChar={userChar}
          updateBoard={updateBoard}
          findBestMove={findBestMove}
        />
      )
    })}
  </div>
)

export default GameBoard
