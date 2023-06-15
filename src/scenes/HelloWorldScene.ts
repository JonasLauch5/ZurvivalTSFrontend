import Phaser, { GameObjects } from 'phaser'
import main from '../main'
import { Vector } from '../data/Vector';
import { Player } from '../data/Player';
import { Zombie } from '../data/Zombie';

export default class HelloWorldScene extends Phaser.Scene
{
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerDataWS: WebSocket;
    private hit: number = 0;
    private zombieList: Zombie[];

    private zombieSprites;
    private numberOfZombies = 0;
    private oldnNumberOfZombies = 0;

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
        // einbinden der Map + Layers
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

        // Kameraeinstellungen
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // Aufbauen der Connection zum Web Socket
        this.playerDataWS = this.connectWS(
            "/Zurvival-16116492623622028638.0-SNAPSHOT/ws/playerdata",
        (msgEvent: MessageEvent) => {
            let receivedList = JSON.parse(msgEvent.data.toString());
            let newzombie: Zombie;
            this.zombieList = [];
            for(let i = 0; i < receivedList.length; ++i) {
                newzombie = receivedList[i];
                //console.log(newzombie);
                this.zombieList.push(new Zombie(
                    newzombie.position,
                    newzombie.acceleration,
                    newzombie.radius,
                    newzombie.max_acceleration
                ));
            }
            console.log(receivedList.toString());
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
            }
        );

        // Collisioneinstellungen
        this.physics.add.collider(this.player,toplayer);
        //this.physics.add.collider(this.zombieSprites, this.player);
        //this.physics.add.collider(this.player,zombies, this.handlePlayerZombieCollision, undefined, this);

        toplayer.setCollisionBetween(251,255);
        toplayer.setCollision(133);
    }   
   
    connectWS = (uri: string, onmessageFunc): WebSocket => {
        uri = "ws://" + "localhost:8080" + uri;
        let ws : WebSocket = new WebSocket(uri);
        //console.log("Soll URL: ws://localhost:8080/Zurvival-1.0-SNAPSHOT/ws/playerdata");
        //console.log("Ist url --- " + uri);
    
        ws.onopen = () => {
            console.log("Connected to " + uri);
        };
        ws.onclose = () => {
            console.log("Disconnected: " + uri);
        };
        ws.onmessage = onmessageFunc;
    
        return ws;
    };

    update(): void {
        setInterval(() => {
            console.log(this.player.x + " " + this.player.y);
            let p = {
                'playerID': 10,
                'position':  new Vector(this.player.x,this.player.y),
                'acceleration': new Vector(20,20)
            };
            this.playerDataWS.send(JSON.stringify(p));
        }, 1000);


        setInterval(() => {
            for (let i = 0; i < this.zombieList.length; i++) {
                const zombie = this.zombieList[i];
                const sprite = this.zombieSprites[i];
                sprite.setPosition(zombie.getPosition().x, zombie.getPosition().y); // Position des Sprites aktualisieren
            }
        }, 100);


        if(this.hit > 0)
        {
            ++this.hit;
            if(this.hit > 10)
            {
                this.hit = 0;
            }
            return
        }

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
