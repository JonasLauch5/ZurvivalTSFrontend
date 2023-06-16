import { Vector } from "./Vector";
import { Movable } from "./Moveable";
/*
* The Player class represents an entity that is controlled by a player.
* */
class Player extends Movable {
    /**
     * The time that has to pass between attacks.
     */
    private ATTACK_COOLDOWN: number = 500;

    /**
     * The keys that are currently being pressed. If a key is pressed that would modify,
     * for example the x axis it gets set to either -1 or 1. If a key isnt pressed, the
     * value is 0.
     */
    private keysPressed: Vector;

    /**
     * The timestamp of when the player attacked last. Used to determine if the attack cooldown is over.
     */
    private lastAttack: number;
    // scene war mal drinnen
    constructor(pos: Vector, size: number) {
        super(
            pos,
            new Vector(0, 0),
            size,
            20,
            100
        );
        this.id = 10; // remove this line (the client will receive the ID from the server)
        this.keysPressed = new Vector(0, 0);
        this.lastAttack = 0;
    }

    public move(deltaTime: number) {
        super.move(deltaTime, this.keysPressed);
    }

    public getKeysPressed(): Vector {
        return this.keysPressed;
    }

    public getLastAttack(): number {
        return this.lastAttack;
    }

    public getAttackCooldown(): number {
        return this.ATTACK_COOLDOWN;
    }

    public setLastAttack(time: number) {
        this.lastAttack = time;
    }
}

export { Player };