const uri = "mongodb+srv://Minwoo:cometrue@minwoo.rdfcfco.mongodb.net/?retryWrites=true&w=m" + "ajority";
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Message = require('./models/message');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {path: '/socket.io'});

const port = process.env.PORT || 3005;

const mongoose = require('mongoose');
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('MongoDB에 연결되었습니다.');
    })
    .catch((error) => {
        console.error('MongoDB 연결 중 오류가 발생했습니다:', error);
    });

// CORS 설정
app.use(cors());

// EJS를 뷰 엔진으로 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 정적 파일을 public 디렉토리에서 제공
app.use(
    '/public',
    express.static(path.join(__dirname, 'public'), {extensions: ['css']})
);

// 채팅 페이지를 렌더링
app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', async (socket) => {
    console.log('사용자가 연결되었습니다.');

    // 채팅 기록 가져오기
    try {
        const messages = await Message
            .find()
            .sort({createdAt: 'asc'});
        socket.emit('chatHistory', messages);
    } catch (error) {
        console.error('채팅 기록을 가져오는 동안 오류가 발생했습니다:', error);
    }

    // 채팅 메시지 수신 및 저장
    socket.on('chatMessage', async (message) => {
        console.log('메시지를 받았습니다:', message);
        try {
            const newMessage = new Message(
                {username: message.username, content: message.content}
            );
            await newMessage.save();

            // 클라이언트에게 메시지와 자신의 ID 전송
            io
                .to(socket.id)
                .emit('chatMessage', {
                    ...message,
                    isMine: true, // 자신의 메시지는 항상 오른쪽에 정렬되도록 설정
                });

            // 다른 클라이언트에게 메시지와 자신의 ID 전송
            socket
                .broadcast
                .emit('chatMessage', {
                    ...message,
                    isMine: false, // 다른 사람의 메시지는 왼쪽에 정렬되도록 설정
                });

            // 클라이언트에게 displayMessage 이벤트 전달
            io.emit('displayMessage', message);
        } catch (error) {
            console.error('메시지를 저장하는 동안 오류가 발생했습니다:', error);
        }
    });

    // 연결 해제 처리
    socket.on('disconnect', () => {
        console.log('사용자가 연결 해제되었습니다.');
    });
});

// 서버 시작
server.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});