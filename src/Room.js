const Player = require("./Player");

class Room {
    constructor(){
        this.players = [];
    }

    getPlayers(){
        return this.players;
    }

    /**
     * 
     * @returns {Player}
     */
    getSamePlayer(player){
        let tpla = this.getPlayers().find(p => p.gamertag === player.gamertag);
        if( tpla != undefined){
            return tpla;
        }
        return null;
    }

    /**
     * 
     * @param {String} name 
     * @returns {Player}
     */
    getPlayerByName(name){
        let bnplayer = this.getPlayers().find(p => p.gamertag === name);
        if( bnplayer != undefined){
            return bnplayer;
        }
        return null;
    }

    /**
     * 
     * @param {Player} player 
     * @returns {boolean}
     */
    inRoom(player){
        if(this.players.some( pl => pl.gamertag == player?.gamertag)){
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {Player} player 
     */
    addPlayer(player){
        this.players.push(player);
    }

    /**
     * 
     * @param {Player} player 
     */
    removePlayer(player){
        let index = this.players.findIndex( pl => pl.gamertag === player.gamertag );
        this.players.splice(index, 1);
    }
}

module.exports = Room;