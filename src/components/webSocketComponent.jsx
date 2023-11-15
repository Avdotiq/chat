import React, { useState, useEffect } from 'react';

const WebSocketComponent = ({
  userId,
  receivedMessages,
  setReceivedMessages,
}) => {
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3030');

    socket.addEventListener('open', () => {
      console.log(`Connected to WebSocket server as user ${userId}`);
    });

    socket.addEventListener('message', (event) => {
      try {
        const { senderId, receiverId, content } = JSON.parse(event.data);
        console.log(event.data);

        setReceivedMessages((prevMessages) => {
          console.log('Previous messages:', prevMessages);
          const updatedMessages = {
            ...prevMessages,
            [senderId]: { receiverId, content },
          };
          console.log('Updated messages:', updatedMessages);
          return updatedMessages;
        });
      } catch (error) {
        console.error('Invalid message format:', event.data);
      }
    });

    socket.addEventListener('close', () => {
      console.log(`Disconnected from WebSocket server as user ${userId}`);
    });

    return () => {
      socket.close();
    };
  }, [userId, setReceivedMessages]);

  console.log(receivedMessages);

  const handleClickSend = () => {
    if (message.trim() !== '' && targetUserId.trim() !== '') {
      const socket = new WebSocket(`ws://localhost:3030/${userId}`);
      socket.addEventListener('open', () => {
        const messageObject = { userId, targetUserId, content: message };
        socket.send(JSON.stringify(messageObject));
        setMessage('');
        setTargetUserId('');
      });
    }
  };

  return (
    <div>
      <div>
          {receivedMessages && Object.keys(receivedMessages).map((key) => {
            const resiver = receivedMessages[key];
            console.log('key.receiverId: ', key.receiverId, 'userID: ', userId);
            if (+key === userId || +resiver.receiverId === userId) {
              return (
                <p key={key}>
                  <strong>User {key}:</strong> {receivedMessages[key].content}
                </p>
              );
            }
            return null;
          })}
      </div>
      <div>
        <input
          type='text'
          placeholder='Target User ID'
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        />
        <input
          type='text'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleClickSend}>Send Message</button>
      </div>
    </div>
  );
};

export default WebSocketComponent;
