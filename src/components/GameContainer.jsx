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
  const [userVal, setUserVal] = useState('o')
  const [compVal, setCompVal] = useState('x')
  const [message, setMessage] = useState('')

  const maxDepth = 3
  const decisionTree = new Map()

  useEffect(() => {
    setHasWon(checkForState())
  }, [gameSquares])

  useEffect(() => {
    if (compVal === 'o' && boardCleared) {
      findBestMove(false)
    }
  })

  useEffect(() => {
    if (userVal === 'x') {
      setCompVal('o')
    } else if (userVal === 'o') {
      setCompVal('x')
    }
  }, [userVal])

  useEffect(() => {
    if (hasWon === 'tie') {
      setMessage('it\'s a tie!')
    } else if (hasWon) {
      setMessage(`${hasWon} wins!`)
    } else if (boardCleared && userVal === 'o') {
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
      ? updateUsedSquares(idx, userVal)
      : updateUsedSquares(idx, compVal)

    updateAvailableSquares(idx)
  }

  // update game squares
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

  const clearBoard = () => {
    setGameSquares(emptyBoard)
    setAvailableSquares(availableBoard)
  }

  // board wipe
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

    // this is the base case. We have proceeded to a win in scenario.
    // return value of the board.
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

    // maximizing, so, o benefits
    if (forMax) {
      // set base to minimum number.
      let max = -100
      availableSquares.forEach((idxAsVal) => {
        // set up a dummy game board to iterate over all scenarios
        const dupeGameSquares = [...squares]
        // try a move and subsequent recursion
        dupeGameSquares.splice(idxAsVal, 1, 'o')
        const nodeVal = findBestMove(false, depth + 1, dupeGameSquares)
        max = Math.max(max, nodeVal)

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
        const moveArr = decisionTree.get(max)
        const move = moveArr[Math.floor(Math.random() * moveArr.length)]
        updateBoard(move, false)
        return move
      }
      // Else, return the maximized move for the next round of recursion.
      return max
    }

    // minimizing, so, x benefits
    if (!forMax) {
      // set base to maximum number.
      let min = 100
      availableSquares.forEach((idxAsVal) => {
        // set up a dummy game board to iterate over all scenarios
        const dupeGameSquares = [...squares]
        // try a move and subsequent recursion
        dupeGameSquares.splice(idxAsVal, 1, 'x')
        const nodeVal = findBestMove(true, depth + 1, dupeGameSquares)
        min = Math.min(min, nodeVal)

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
        const moveArr = decisionTree.get(min)
        const move = moveArr[Math.floor(Math.random() * moveArr.length)]
        updateBoard(move, false)
        return move
      }
      // Else, return the maximized move for the next round of recursion.
      return min
    }
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
          userVal={userVal}
          done={hasWon}
          findBestMove={findBestMove}
        />
        <div>
          <Settings
            updateUserVal={setUserVal}
            userVal={userVal}
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
