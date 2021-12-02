import React from 'react'
import GameSquare from './GameSquare.jsx'
import './GameBoard.css'

const GameBoard = ({ gameSquares, updateBoard, done, findBestMove, userVal }) => (
  <div className='gameBoard' style={{ pointerEvents: done ? 'none' : 'auto' }}>
    {gameSquares.map((val, idx) => {
      return (
        <GameSquare
          key={idx}
          id={idx}
          val={val}
          userVal={userVal}
          updateBoard={updateBoard}
          findBestMove={findBestMove}
        />
      )
    })}
  </div>
)

export default GameBoard
