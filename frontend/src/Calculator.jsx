import { useState } from 'react'
import './Calculator.css'

export default function Calculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleClick = (value) => {
    if (result !== '') {
      setInput(result + value)
      setResult('')
    } else {
      setInput(input + value)
    }
  }

  const handleClear = () => {
    setInput('')
    setResult('')
  }

  const handleBackspace = () => {
    setInput(input.slice(0, -1))
  }

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input)
      setResult(evalResult.toString())
    } catch {
      setResult('Error')
    }
  }

  return (
    <div className="calculator">
      <div className="display">
        <input value={input} readOnly placeholder="0" />
        <div className="result">{result}</div>
      </div>
      <div className="buttons">
        <button onClick={handleClear}>C</button>
        <button onClick={handleBackspace}>←</button>
        <button onClick={() => handleClick('%')}>%</button>
        <button onClick={() => handleClick('/')}>÷</button>

        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('*')}>×</button>

        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('-')}>−</button>

        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('+')}>+</button>

        <button onClick={() => handleClick('0')} className="zero">0</button>
        <button onClick={() => handleClick('.')}>.</button>
        <button onClick={handleCalculate}>=</button>
      </div>
    </div>
  )
}