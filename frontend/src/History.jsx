import React from 'react';

function History({ history, loading }) {
  if (loading) {
    return <div>Loading history...</div>;
  }

  if (!history || history.length === 0) {
    return <div>No history yet.</div>;
  }

  return (
    <div className="history">
      <h3>History</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>{item.expression} = {item.result}</li>
        ))}
      </ul>
    </div>
  );
}

export default History;