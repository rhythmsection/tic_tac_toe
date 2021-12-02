import React, { useState, useEffect } from 'react'
import GameBoard from './GameBoard.jsx'
import Settings from './Settings.jsx'
import './GameContainer.css'

const GameContainer = () => {
  const emptyBoard = ['', '', '', '', '', '', '', '', '']
  const availableBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  const [gameSquares, setGameSquares] = useState(emptyBoard)
  const [availableSquares, setAvailableSquares] = useState(availableBoard)
  const [hasWon, setHasWon] = useState('')
  const [userChar, setUserChar] = useState('o')
  const [compChar, setCompChar] = useState('x')
  const [message, setMessage] = useState('')

  const maxDepth = 3
  const decisionTree = new Map()

  useEffect(() => {
    setHasWon(checkForState())
  }, [gameSquares])

  useEffect(() => {
    if (compChar === 'o' && boardCleared) {
      findBestMove(false)
    }
  })

  useEffect(() => {
    if (userChar === 'x') {
      setCompChar('o')
    } else if (userChar === 'o') {
      setCompChar('x')
    }
  }, [userChar])

  useEffect(() => {
    if (hasWon === 'tie') {
      setMessage('it\'s a tie!')
    } else if (hasWon) {
      setMessage(`${hasWon} wins!`)
    } else if (boardCleared && userChar === 'o') {
      setMessage('you first')
    } else {
      setMessage('')
    }
  })

  // check the board for fullness. If full and no winner, tie.
  const boardFullCheck = () => {
    for (var square of gameSquares) {
      if (square === '') {
        return false
      }
    }
    return true
  }

  // check for board state
  const checkForState = (squares = gameSquares) => {
    const wins = [
      [0, 1, 2], // horizontals
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // verticals
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // diagonals
      [2, 4, 6]
    ]

    // check for wins by trio
    for (var win of wins) {
      const sq1 = squares[win[0]]
      const sq2 = squares[win[1]]
      const sq3 = squares[win[2]]
      const winCheck = [sq1, sq2, sq3]

      if (winCheck.every((sq) => sq === winCheck[0] && sq !== '')) {
        return sq1
      }
    }

    // board is full, no more moves, win check failed, must tie
    if (boardFullCheck()) {
      return 'tie'
    }

    // board is not full and win check failed
    return ''
  }

  const updateBoard = (idx, asPlayer = true) => {
    asPlayer
      ? updateUsedSquares(idx, userChar)
      : updateUsedSquares(idx, compChar)

    updateAvailableSquares(idx)
  }

  // update filled squares
  const updateUsedSquares = (idx, val) => {
    gameSquares.splice(idx, 1, val)
    setGameSquares([...gameSquares])
  }

  // update available squares
  const updateAvailableSquares = (idx) => {
    const index = availableSquares.indexOf(idx)
    if (index > -1) {
      availableSquares.splice(index, 1)
    }
    setAvailableSquares([...availableSquares])
  }

  // board wipe
  const clearBoard = () => {
    setGameSquares(emptyBoard)
    setAvailableSquares(availableBoard)
  }

  // board is empty
  const boardCleared = gameSquares.every((sq) => sq === '')

  // recursive minimax algorithm
  // https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
  // https://www.neverstopbuilding.com/blog/minimax
  // https://en.wikipedia.org/wiki/Minimax
  const findBestMove = (forMax = true, depth = 0, squares = gameSquares) => {
    // clear if no depth, that means we're starting from square one.
    if (depth === 0) {
      decisionTree.clear()
    }

    // We have proceeded to an endpoint in the currently running scenario.
    // return value of this path.
    if (checkForState(squares) !== '' || depth === maxDepth) {
      // time for some arbitrary decision making
      if (checkForState(squares) === 'o') {
        // if the move benefits o, it is maximized (rated by positivity)
        return 100 - depth
      } else if (checkForState(squares) === 'x') {
        // if the move benefits x, it is minimized (rated by negativity)
        return -100 + depth
      } else {
        return 0
      }
    }

    // if forMax, o benefits, !forMax, x benefits
    // set base minimax value.
    let base = forMax ? -100 : 100
    const char = forMax ? 'o' : 'x'

    availableSquares.forEach((idxAsVal) => {
      // set up a dummy game board to iterate over all scenarios
      const dupeGameSquares = [...squares]
      // try a move and subsequent recursion
      dupeGameSquares.splice(idxAsVal, 1, char)
      const nodeVal = findBestMove(!forMax, depth + 1, dupeGameSquares)
      base = forMax
        ? Math.max(base, nodeVal)
        : Math.min(base, nodeVal)

      // when we are not recursing, do this.
      if (depth === 0) {
        // If we already have the value, add an index as another possible move
        // at that value.
        const moves = decisionTree.has(nodeVal)
          ? [...decisionTree.get(nodeVal), idxAsVal]
          : [idxAsVal]

        decisionTree.set(nodeVal, moves)
      }
    })

    // when we are not recursing, do this.
    if (depth === 0) {
      // remember that collection of indexes we made when value was the same?
      // now we arbitrarily choose one.
      const moveArr = decisionTree.get(base)
      const move = moveArr[Math.floor(Math.random() * moveArr.length)]
      updateBoard(move, false)
      return move
    }
    // Else, return the maximized move for the next round of recursion.
    return base
  }

  return (
    <div className='gameContainer'>
      <div className='titleContainer'>
        tic tac toe
      </div>
      <div className='mainContainer'>
        <GameBoard
          gameSquares={gameSquares}
          updateBoard={updateBoard}
          userChar={userChar}
          done={hasWon}
          findBestMove={findBestMove}
        />
        <div>
          <Settings
            updateUserChar={setUserChar}
            userChar={userChar}
            done={hasWon}
            clearBoard={clearBoard}
          />
          <div className='messageContainer'>
            {message}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameContainer
