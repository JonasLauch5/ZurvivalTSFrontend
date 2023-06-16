import { Movable } from "./Moveable";
import { Vector } from "./Vector";

class Zombie extends Movable {
    /**
     * The amount of health points the zombie takes when hitting the player.
     * @private
     */

    private strength: number;
    /**
     * The amount that has to pass after a hit until the zombie can hit again.
     * @private
     */
    private attackSpeed: number;

    constructor(position: Vector, acceleration: Vector, radius: number, max_acceleration: number,healthPoints: number) {
        super(position, acceleration,radius,max_acceleration,healthPoints);
    }

}

export { Zombie };