const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username-input');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');

// 소켓 연결
const socket = io();

// 메시지 전송
sendButton.addEventListener('click', () => {
  const username = usernameInput.value;
  const content = messageInput.value;

  if (username && content) {
    const message = {
      username: username,
      content: content,
      isMine: true
    };

    // 메시지 전송
    socket.emit('chatMessage', message);
    // 채팅창 초기화
    messageInput.value = '';
  }
});

// 채팅 메시지 표시 함수
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = `${message.username}: ${message.content}`;

  if (message.isMine) {
    messageElement.classList.add('my-message');
  } else {
    messageElement.classList.add('other-message');
  }

  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 채팅창 초기화
clearButton.addEventListener('click', () => {
  chatWindow.innerHTML = '';
});