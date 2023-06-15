import Phaser from 'phaser'

enum Direction 
{
    UP,
    LEFT,
    RIGHT,
    DOWN
}

const randomDirection = (exclude: Direction) => {
    let newDirection = Phaser.Math.Between(0,3);
    while (newDirection === exclude)
    {
        newDirection = Phaser.Math.Between(0,3);
    }
    return newDirection;
}

export default class ZombieFrontent extends Phaser.Physics.Arcade.Sprite
{
    private direction: Direction = Direction.RIGHT;
    private moveEvent: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x:number, y:number, texture:string, frame?:string)
    {
        super(scene,x,y,texture,frame)

        scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE,this.handleTileCollision, this);

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.direction = randomDirection(this.direction);
            },
            loop: true
        })
    }

    private handleTileCollision(game: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile)
    {
        if(game !== this)
        {
            return
        }
        this.direction = randomDirection(this.direction);
    }

    preUpdate(t: number, dt:number)
    {
        super.preUpdate(t,dt);
        const speed: number = 100;
        switch (this.direction)
        {
            case Direction.UP: this.setVelocity(0, -speed)
                break;
            case Direction.DOWN: this.setVelocity(0, speed)
                break;
            case Direction.LEFT: this.setVelocity(-speed, 0)
                break;
            case Direction.RIGHT: this.setVelocity(speed, 0)
                break;
        }
    }

    destroy(frameScene?: boolean) {
        this.moveEvent.destroy();
        super.destroy(frameScene);
    }
}

