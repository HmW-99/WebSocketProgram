// 소켓 연결
const socket = io();

const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');

// 발신자 정보 설정
const senderInfo = {
    id: Math
        .random()
        .toString(36)
        .substr(2, 9), // 임의의 ID 생성
    name: '' // 사용자 이름을 저장하지 않으므로 빈 문자열로 설정
};

socket.on('connect', () => {
    if (chatForm && chatBox) {
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('m');
            const message = messageInput.value;
            const chatMessage = {
                sender: senderInfo,
                content: message
            };
            socket.emit('chatMessage', chatMessage);
            messageInput.value = '';
            chatBox.appendChild(makeMessage(chatMessage, true));
        });

        clearButton.addEventListener('click', (e) => {
            e.preventDefault();
            chatBox.innerHTML = '';
        });
    }
});

const makeMessage = (message, isMine) => {
    const msgBox = document.createElement('div');
    const classname = isMine
        ? 'my-message-wrapper'
        : 'others-message-wrapper';
    msgBox.className = classname;
    msgBox.innerText = message.content;
    return msgBox;
};

function displayMessage(message) {
    chatBox.appendChild(makeMessage(message, false));
}

socket.on('chatMessage', (message) => {
    if (message.sender.id !== senderInfo.id) {
        // 상대방이 보낸 메세지인 경우만 표시
        displayMessage(message);
    }
});