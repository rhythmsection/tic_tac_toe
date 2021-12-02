import React, { useState, useEffect } from 'react'
import './GameSquare.css'

const GameSquare = ({ id, val, userVal, updateBoard, findBestMove }) => {
  const [printVal, setPrintVal] = useState('')

  useEffect(() => {
    if (val === 'x') {
      setPrintVal('\u2716')
    } else if (val === 'o') {
      setPrintVal('\u2B58')
    } else {
      setPrintVal(val)
    }
  })

  return (
    <div
      className='gameSquare'
      onClick={() => {
        updateBoard(id)
        if (userVal === 'o') {
          // next move is 'x'
          findBestMove(true)
        } else if (userVal === 'x') {
          // next move is 'o'
          findBestMove(false)
        }
      }}
    >
      {printVal}
    </div>
  )
}

export default GameSquare
