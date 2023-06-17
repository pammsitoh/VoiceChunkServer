const Vector3 = require("./sys/Vector3");

class Player {

    constructor(gamertag, peerId, socket){
        this.gamertag = gamertag;
        this.peerId = peerId;
        this.socket = socket;

        this.position = new Vector3(0,0,0);
        this.dimension = 0;

        this.talking = false;
        this.muted = false;
        this.deafen = false;
    }

    /**
     * 
     * @returns {String}
     */
    getGamertag(){
        return this.gamertag;
    }

    /**
     * 
     * @returns {String}
     */
    getPeerId(){
        return this.peerId;
    }

    /**
     * 
     * @returns {Vector3}
     */
    getPosition(){
        return this.position;
    }

    /**
     * 
     * @returns {number}
     */
    getDimension(){
        return this.dimension;
    }

    getSocket(){
        return this.socket;
    }

    /**
     * 
     * @returns {boolean}
     */
    isMuted(){
        return this.muted;
    }

    /**
     * 
     * @returns {boolean}
     */
    isDeafen(){
        return this.deafen;
    }

    /**
     * @returns {boolean}
     */
    isTalking(){
        return this.talking;
    }

    /**
     * 
     * @param {boolean} bool 
     */
    setTalking(bool){
        this.talking = bool;
    }

    /**
     * 
     * @param {boolean} bool 
     */
    setMuted(bool){
        this.muted = bool;
    }

    /**
     * 
     * @param {boolean} bool 
     */
    setDeafen(bool){
        this.deafen = bool;
    }

    /**
     * 
     * @param {Vector3} vector
     */
    setPosition(vector){
        this.position = vector;
    }

    /**
     * 
     * @param {String} dimension 
     */
    setDimension(dimension){
        this.dimension = dimension;
    }
}

module.exports = Player;