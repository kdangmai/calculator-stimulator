import { useState, useEffect } from 'react'
import './Calculator.css'
import History from './History'; // Import component History


export default function Calculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm để tải lịch sử từ backend
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/history'); // Sử dụng proxy của Vite
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }

  // Sử dụng useEffect để gọi fetchHistory() một lần khi component được mount
  useEffect(() => {
    fetchHistory();
  }, []); // Mảng rỗng `[]` đảm bảo hook này chỉ chạy một lần

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

  // Hàm tính toán an toàn hơn để thay thế eval()
  // Đây là một ví dụ đơn giản, bạn nên dùng thư viện như 'mathjs' cho ứng dụng thực tế
  const safeCalculate = (expression) => {
    // Lọc các ký tự không hợp lệ để tăng cường bảo mật
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    try {
      // eslint-disable-next-line no-new-func
      return new Function('return ' + sanitizedExpression)();
    } catch (error) {
      console.error("Calculation error:", error);
      throw new Error("Invalid expression");
    }
  }

  const handleCalculate = async () => {
    if (input === '') return;
    try {
      // CẢNH BÁO BẢO MẬT: Sử dụng eval() rất nguy hiểm.
      // Thay thế bằng một hàm tính toán an toàn hơn.
      const evalResult = safeCalculate(input);
      const resultString = evalResult.toString();
      setResult(resultString);

      // Gửi phép tính và kết quả đến backend để lưu lại
      const calculation = { expression: input, result: resultString };
      
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculation),
      });
      
      // Tải lại lịch sử để cập nhật giao diện
      await fetchHistory();
    } catch (error) {
      setResult('Error');
    }
  }

  return (
    <div className="app-container">
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
      <div className="history-container">
        <History history={history} loading={loading} />
      </div>
    </div>
  )
}