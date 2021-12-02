import React from 'react'
import './GameSquare.css'

const GameSquare = ({ id, userVal, updateBoard, findBestMove }) => (
  <div
    className='gameSquare'
    onClick={() => {
      updateBoard(id)
      findBestMove()
    }}
  >
    {userVal}
  </div>
)

export default GameSquare
