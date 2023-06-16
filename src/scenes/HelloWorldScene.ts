import Phaser, { GameObjects } from 'phaser'
import main from '../main'
import { Vector } from '../data/Vector';
import { Player } from '../data/Player';
import { Zombie } from '../data/Zombie';
import { MessageType } from '../data/MessageType';
import { Message } from '../data/MessageType';

/* This is my mainscene where the game takes place. It is sturctured in preload, create and update methods. 
  In the preload you can load your assets. In the create you initiate your variables and the update method is called uninterrupted.
*/

export default class HelloWorldScene extends Phaser.Scene
{
    // configuring of some variables
    // the phaser player
    private player?: Phaser.Physics.Arcade.Sprite;
    // the player from the server with all known functions
    private gamePlayer: Player;
    // takes keys from keyboard
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    // websocket
    private playerDataWS: WebSocket;
    private hit: number = 0;
    private zombieList: Zombie[];
    // displays all zombies which were send from the sever
    private zombieSprites;
    private numberOfZombies: number = 0;
    private oldnNumberOfZombies: number = 0;

	constructor()
	{
        super('HelloWorldScene');
	}

	preload()
    {
        this.load.image('tiles', 'assets/mountain_landscape.png')
        this.load.image('Player','assets/playerfigure.png')
        this.load.image('Player2','assets/playerimage.png')
        this.load.tilemapTiledJSON('map', '/assets/maps/map.json');
        this.load.image('Zombie','assets/ZombiePixelart.png')
    }

    create()
    {
        // insert Map + Layers
        const map = this.make.tilemap({key: "map", tileWidth: 32, tileHeight: 32});
        const tileset = map.addTilesetImage("mountain_landscape","tiles");
        const botlayer = map.createLayer("bottomLayer", tileset, 0, 0);
        const toplayer = map.createLayer("topLayer", tileset, 0, 0);

        // Rand gesetzt damit der Spieler nicht über die Map hinaus geht
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //erzeugen eines Spielers
        this.player=this.physics.add.sprite(0,0,"Player");
        this.player.setScale(0.05,0.07);
        this.player.setCollideWorldBounds(true);

        this.gamePlayer = new Player(new Vector(0,0),8);

        // Kameraeinstellungen
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

         /**
         * This WebSocket is used to transmit the data of the player to the server.
         * It also receives the positions of the other players.
         * When the pages is being left the WebSocket gets closed.
         */
        this.playerDataWS = this.connectWS(
            "/Zurvival-16116492623622028638.0-SNAPSHOT/ws/playerdata",
        (msgEvent: MessageEvent) => {
            let msg = JSON.parse(msgEvent.data.toString());
            // important so that you can use Message methods
            msg = new Message(msg.data, msg.type);
            switch(Message.getMessageTypeFromString(msg.type)) {
                case MessageType.ZombieList:
                    let receivedList: Zombie[] = msg.data;
                    let newzombie: Zombie;
                    this.zombieList = [];
                    for(let i = 0; i < receivedList.length; ++i) {
                        newzombie = receivedList[i];
                        this.zombieList.push(new Zombie(
                            newzombie.position,
                            newzombie.acceleration,
                            newzombie.radius,
                            newzombie.max_acceleration,
                            newzombie.healthPoints
                        ));
                    }
                    this.numberOfZombies = this.zombieList.length;
                    if(this.numberOfZombies != this.oldnNumberOfZombies)
                    {
                        this.zombieSprites = [];
                        for (let i = 0; i < this.zombieList.length; i++) {
                            let zombie: Zombie = this.zombieList[i];
                            const sprite = this.physics.add.sprite(zombie.getPosition().x, zombie.getPosition().y, 'Zombie').setScale(0.08, 0.1);
                            this.zombieSprites.push(sprite); 
                        }
                    }
                    this.oldnNumberOfZombies = this.numberOfZombies;
                    break;
                    case MessageType.PlayerList:
                        console.log("PlayerList")
                        
                        break;
    
                    case MessageType.PlayerDamage:
                        this.gamePlayer.setHealthPoints(msg.data);
                        console.log("damge spieler")
                        console.log("Spieler:"+this.gamePlayer.getHealthPoints());
                        break;
    
                    default:
                        console.log("Unknown MessageType: " + msg.getType());
                        break;
            }
        }
        );

        // Collisioneinstellungen
        this.physics.add.collider(this.player,toplayer);
        //this.physics.add.collider(this.zombieSprites, this.player);
        //this.physics.add.collider(this.player,zombies, this.handlePlayerZombieCollision, undefined, this);

        toplayer.setCollisionBetween(251,255);
        toplayer.setCollision(133);
    }   
   

    /**
 * Connects the given websocket to the given uri.
 * The uri does not need to contain the complete host.
 * Only the resource is needs to be given.
 * It returns a WebSocket connected to the given uri.
 * @param uri The resource endpoint the WebSocket should be connected to.
 * @param onmessageFunc This is the function that should be executed when a message reaches the client. It should have one MessageEvent parameter.
 */
    connectWS = (uri: string, onmessageFunc): WebSocket => {
        uri = "ws://" + "localhost:8080" + uri;
        let ws : WebSocket = new WebSocket(uri);
    
        ws.onopen = () => {
            console.log("Connected to " + uri);
        };
        ws.onclose = () => {
            console.log("Disconnected: " + uri);
        };
        ws.onmessage = onmessageFunc;
    
        return ws;
    };

    // when a click happens this function is called  
    public onclickCallback = (event: MouseEvent) => {
        let now: number = Date.now();

        // when the cooldown isnt over yet dont attack
        if(this.gamePlayer.getAttackCooldown() > (now - this.gamePlayer.getLastAttack()))
            return;
        this.gamePlayer.setLastAttack(now);

        // send mouse position to server
        let p = {
            'playerID': 10,
            'position': new Vector(this.player.x,this.player.y),
            'acceleration': new Vector(event.x, event.y)
        };
        console.log("Click: "+event.x+" "+event.y);
        console.log(this.player.x + " " + this.player.y);
        
        for (let i = 0; i < this.zombieList.length; i++) {
            console.log("Zombie Leben: " + this.zombieList[i].getHealthPoints());
        }

        let msg: Message = new Message(p, MessageType.PlayerAttack);
        this.playerDataWS.send(JSON.stringify(msg));
    };


    update(): void {
        // send the playerdata to the server
        setInterval(() => {
            let p = {
                'playerID': 10,
                'position':  new Vector(this.player.x,this.player.y),
                'acceleration': new Vector(20,20)
            };
            //this.playerDataWS.send(JSON.stringify(p));
            let msg: Message = new Message(p, MessageType.PlayerInfo);
            this.playerDataWS.send(JSON.stringify(msg));
            this.gamePlayer.setPosition(new Vector(this.player.x,this.player.y));
        }, 1000);

        // moves the sprite to the next location
        setInterval(() => {
            for (let i = 0; i < this.zombieList.length; i++) {
                const zombie = this.zombieList[i];
                const sprite = this.zombieSprites[i];
                sprite.setPosition(zombie.getPosition().x, zombie.getPosition().y); 
            }
        }, 100);

        document.getElementById("body").addEventListener("click", this.onclickCallback);
        /*
        if(this.hit > 0)
        {
            ++this.hit;
            if(this.hit > 10)
            {
                this.hit = 0;
            }
            return
        }
        */

        // Controllers
        var keys = this.input.keyboard.addKeys('W,A,S,D');

        if (this.cursors.left.isDown || keys.A.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown || keys.D.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }
        if (this.cursors.up.isDown || keys.W.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown || keys.S.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
        }
        
    }
}
