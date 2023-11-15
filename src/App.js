import { useState } from 'react';
import './App.css';
import WebSocketComponent from './components/webSocketComponent';

function App() {
  const [receivedMessages, setReceivedMessages] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <WebSocketComponent userId={1} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages} />
        <WebSocketComponent userId={2} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages} />
        <WebSocketComponent userId={3} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages} />
      </header>
    </div>
  );
}

export default App;
