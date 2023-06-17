const Player = require("../Player");

class SocketEvents{
    #socket;
    constructor(socket, VoiceRoom, players_data, sockets) {
        this.#socket = socket;
        this.VoiceRoom = VoiceRoom;
        this.players_data = players_data;
        this.sockets = sockets;
    }

    initialize(){
        this.voice_activity();
        this.enter_request();
        this.disconnect();
    }

    getSocket(){
        return this.#socket;
    }

    //EVENTS...
    voice_activity(){
        //VoiceActivity
        this.#socket.on('voice_activity', info => {
            if(this.VoiceRoom.inRoom(info)){
              let player = this.VoiceRoom.getSamePlayer(info);
              player.setTalking(info.talking);
              player.setMuted(info.muted);
              player.setDeafen(info.deafen);
            }
        });
    }

    enter_request(){
        //Cuando Un Cliente Solicita Entrar Al Servidor De Voz...
        this.#socket.on('enter_request', info => {
            console.log(`[VC] ${info.gamertag} solicitando entrada con id: `.yellow + info.peer_id);
            if( this.players_data.some( pl => pl.gamertag === info.gamertag) && !this.VoiceRoom.inRoom(info)){
              this.VoiceRoom.addPlayer(new Player(info.gamertag, info.peer_id, this.#socket));
            }
        });
    }

    disconnect(){
        //Socket Desconectado...
        this.#socket.on('disconnect',() => {
            let check = this.sockets.indexOf(this.#socket);
            this.sockets.splice(check,1);
        })
    }
}

module.exports = SocketEvents;