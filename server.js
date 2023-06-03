const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('클라이언트가 연결되었습니다.');

  ws.on('message', (message) => {
    console.log('수신한 메시지:', message);
    // 다른 클라이언트에게 메시지를 전송합니다.
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('클라이언트와의 연결이 종료되었습니다.');
  });
});
