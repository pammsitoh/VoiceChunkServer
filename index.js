const { PeerServer } = require('peer');
const colors = require('colors');
const figlet = require('figlet');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const Room = require('./src/Room');
const Player = require('./src/Player');
const Vector3 = require('./src/sys/Vector3');
const SocketEvents = require('./src/sys/SocketEvents');

figlet.text(
  "VoiceChunk",
  {
    font: "Rectangles",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  },
  function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data.cyan);
    console.log("[VC] Starting server...".yellow);
    StartServer();
  }
);

const StartServer = () => {
  //GLOBAL
  let players_data = [];
  let VoiceRoom = new Room();

  const io = new Server(server);

  const peerServer = PeerServer({ port: 9000, path: '/vcserver' }); // Puedes personalizar el puerto y la ruta según tus necesidades...

  peerServer.on('connection', (client) => {
    console.log('[VC] Nuevo cliente conectado:'.yellow, client.getId().magenta);
  });

  peerServer.on('disconnect', (client) => {
    let disconectedPlayer = VoiceRoom.getPlayers().find( py => py.getPeerId() === client.getId() );
    if(VoiceRoom.inRoom(disconectedPlayer)){
      VoiceRoom.removePlayer(disconectedPlayer);
      console.log(`[VC] ${disconectedPlayer.getGamertag()} salio del servidor de voz`.yellow);
      io.sockets.emit('voice_disconnect', {
        gamertag: disconectedPlayer.getGamertag()
      });
    }
  });

  //Socket.IO
  let sockets = [];

  io.on('connection', (socket) => {
    sockets.push(socket);
    
    const register_events = new SocketEvents(socket, VoiceRoom, players_data, sockets);
    register_events.initialize();
  });

  server.listen(8000, () => {
      console.log('[VC] listening on *:8000'.yellow);
  });

  //GET DATA FROM SERVER
  app.use(express.json());

  app.post('/playerdata', (req, res) => {
    const datos = req.body;
    // Hacer algo con los datos recibidos
    players_data = datos;

    //Crear un player por cada nuevo no existente en el VoiceRoom
    datos.forEach( vPlayer => {
      if(VoiceRoom.inRoom(vPlayer)){
        let myplayer = VoiceRoom.getSamePlayer(vPlayer);
        myplayer?.setPosition(new Vector3(vPlayer.position.x,vPlayer.position.y,vPlayer.position.z));
        myplayer?.setDimension(vPlayer.dimension);
      }
    });

    let datta = {
      general: datos,
      room: VoiceRoom.getPlayers().map(pli => {
        return {
          gamertag: pli.gamertag,
          peerId: pli.getPeerId(),
          position: datos.find(po => po.gamertag === pli.gamertag)?.position,
          dimension: pli.dimension
        }
      })
    }

    io.sockets.emit('AllPlayerData',datta);

    res.send(VoiceRoom.getPlayers().map(py => {
      return {
        gamertag: py.gamertag,
        talking: py.isTalking(),
        muted: py.isMuted(),
        deafen: py.isDeafen()
      }
    }));
  });

  app.listen(7000, () => {
    console.log(`[VC] Servidor HTTP escuchando en el puerto ${7000}`.yellow);
  });
}