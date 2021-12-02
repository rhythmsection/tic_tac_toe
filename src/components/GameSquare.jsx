import React, { useState, useEffect } from 'react'
import './GameSquare.css'

const GameSquare = ({ id, char, userChar, updateBoard, findBestMove }) => {
  const [printChar, setPrintChar] = useState('')

  // nicer 'x's and 'o's
  useEffect(() => {
    if (char === 'x') {
      setPrintChar('\u2716')
    } else if (char === 'o') {
      setPrintChar('\u2B58')
    } else {
      setPrintChar(char)
    }
  })

  return (
    <div
      style={{ pointerEvents: char ? 'none' : 'auto' }}
      className='gameSquare'
      onClick={() => {
        updateBoard(id)
        if (userChar === 'o') {
          // next move is 'x'
          findBestMove(true)
        } else if (userChar === 'x') {
          // next move is 'o'
          findBestMove(false)
        }
      }}
    >
      {printChar}
    </div>
  )
}

export default GameSquare
