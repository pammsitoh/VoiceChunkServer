const PeerServer = require('peer').PeerServer;

const server = PeerServer({
  port: 9000,
  path: '/peerjs'
});

server.on('connection', (conn) => {
  console.log(`Cliente Conectado con id: ${conn.getId()}`);
})

server.on('disconnect', (conn) => {
  console.log(`Un Cabron se Desconecto con id: ${conn.getId()}`);
}) 