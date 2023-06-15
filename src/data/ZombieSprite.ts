import { Scene } from "phaser";
import { Zombie } from "./Zombie";
/*

// Definieren Sie Ihre eigene Klasse
class ZombieSprite extends Phaser.GameObjects.GameObject{
    sprite: Phaser.GameObjects.Sprite;
    zombie: Zombie;

    constructor(scene: Phaser.Scene, zombie: Zombie, spriteKey: string, frame?: string | number) {
    
      super(scene,'HelloWorldScene');
      this.zombie = zombie;
      //this.sprite = new Phaser.GameObjects.Sprite(game, zombie.getPosition().x, zombie.getPosition().y, 'Zombie', frame);
      //this.sprite.setScale(0.08,0.1);
       //this.scene.add.sprite(zombie.getPosition().x, zombie.getPosition().y,'Zombie');
       this.sprite = scene.add.sprite(this.zombie.getPosition().x, this.zombie.getPosition().y,spriteKey,frame);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
    
        // Aktualisiere die Position des Sprites basierend auf der Position des Objekts
        this.sprite.x = this.zombie.getPosition().x;
        this.sprite.y = this.zombie.getPosition().y;
      }

    public getSprite(): Phaser.GameObjects.Sprite
    {
        return this.sprite;
    }
    /*constructor (scene:Scene, x, y, texture, frame, options)
    {
        super(scene.matter.world, x, y, texture,frame,options);

        scene.add.existing(this);
    }*/
    /*
    private sprite;

    private scene;

    constructor(scene, x, y, spriteKey)
    {
        this.scene = scene;

        this.sprite = new Phaser.GameObjects.Sprite(scene,x,y,spriteKey);
        this.sprite.setScale(0.08,0.1);

        scene.add.existing(this.sprite);
    }
  }
  export { ZombieSprite };*/


  class ZombieSprite extends Phaser.GameObjects.GameObject {
    constructor(scene: Phaser.Scene, x: number, y: number) {
      super(scene, 'ZombieSprite');
  
      // Add any initialization code for your custom object here
      // For example, you can create sprites, graphics, or other Phaser game objects
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xff0000);
      graphics.fillRect(0, 0, 100, 100);
      this.setSize(100, 100);
      this.setPosition(x, y);
      this.setInteractive(); // Enable interactivity if needed
    }
  
    preUpdate(time: number, delta: number) {
      // Add any update logic for your custom object here
      // This method is called automatically by Phaser on every game update tick
    }
  }