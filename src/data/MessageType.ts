enum MessageType {
    ZombieList = "ZombieList",
    PlayerList = "PlayerList",
    PlayerInfo = "PlayerInfo",
    PlayerDamage = "PlayerDamage",
    PlayerAttack = "PlayerAttack",
}

/*
* A class used to transport messages between the Server and the client.
* */
class Message {
    public data;
    public type: MessageType;

    constructor(data, type : MessageType) {
        this.data = data;
        this.type = type;
    }

    public getData() {
        return this.data;
    }

    public getType(): MessageType {
        return this.type;
    }

    public static getMessageTypeFromString(str: string): MessageType {
        if(str === "ZombieList")
            return MessageType.ZombieList;
        if(str === "PlayerList")
            return MessageType.PlayerList;
        if(str === "PlayerDamage")
            return MessageType.PlayerDamage;
    }
}

export { Message };
export { MessageType };