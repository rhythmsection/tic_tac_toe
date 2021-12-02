import React from 'react'
import GameSquare from './GameSquare.jsx'
import './GameBoard.css'

const GameBoard = ({ gameSquares, updateBoard, done, findBestMove }) => {
  return (
    <div className='gameBoard' style={{ pointerEvents: done ? 'none' : 'auto' }}>
      {gameSquares.map((val, idx) => {
        let userVal = ''
        if (val === '') {
          userVal = ''
        } else if (val === 'x') {
          userVal = '\u2716'
        } else if (val === 'o') {
          userVal = '\u2B58'
        }

        return (
          <GameSquare
            key={idx}
            id={idx}
            userVal={userVal}
            updateBoard={updateBoard}
            findBestMove={findBestMove}
          />
        )
      })}
    </div>
  )
}

export default GameBoard
