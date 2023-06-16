import {Vector} from "./Vector.js";

class Movable {
    /**
     * The maximum acceleration the moving entity can reach.
     */
    protected maxAcceleration: number;
    /**
     * The rates at which the entity accelerates and decelerates.
     * A rate of 80 means that the entity can accelerate by 80 units per second.
     * @protected
     */
    protected accelerationRate: number;
    protected decelerationRate: number;

    /**
     * The ID of the entity that was given to them by the server.
     */
    protected id: number;
    /**
     * The position of the movable inside the game world.
     */
    protected position: Vector;
    /**
     * In which direction the movable is currently accelerating.
     */
    protected acceleration: Vector;
    /**
     * The size of the drawn movable.
     */
    protected radius: number;
    /**
     * The amount of damage an entity can take until it is defeated
     * and the amount the entity had in the beginning.
     * @protected
     */
    protected healthPoints: number;

    constructor(pos: Vector, accel: Vector, radius: number, maxAcceleration: number, healthPoints: number) {
        this.position = pos;
        this.acceleration = accel;
        this.radius = radius;
        this.maxAcceleration = maxAcceleration;
        this.accelerationRate = 80;
        this.decelerationRate = 40;
        this.healthPoints = healthPoints;
    }

    /**
     * Accelerates and moves the entity in the given direction.
     * @param deltaTime The amount of time that has passed since the player was moved. Measured in seconds
     * @param accelerationDirection The direction the entity accelerates in.
     */
    public move(deltaTime: number, accelerationDirection: Vector) {
        // the amount of acceleration that was gained in the last deltaTime amount of time.
        const ACCELERATION: number = this.accelerationRate * deltaTime;
        const DECELERATION: number = this.decelerationRate * deltaTime;

        // Decelerate
        this.acceleration.x -= DECELERATION * this.acceleration.x / this.maxAcceleration;
        this.acceleration.y -= DECELERATION * this.acceleration.y / this.maxAcceleration;
        // If the acceleration gets too small set it to 0. This prevents unnecessary long numbers.
        if(this.acceleration.x < 0.3 && this.acceleration.x > -0.3)
            this.acceleration.x = 0;
        if(this.acceleration.y < 0.3 && this.acceleration.y > -0.3)
            this.acceleration.y = 0;

        // Accelerate
        this.acceleration.x += accelerationDirection.x * ACCELERATION;
        this.acceleration.y += accelerationDirection.y * ACCELERATION;
        // if the acceleration gets too high or low it gets set to maxAcceleration or -maxAcceleration
        if(this.acceleration.x > this.maxAcceleration)
            this.acceleration.x = this.maxAcceleration;
        if(this.acceleration.x < -this.maxAcceleration)
            this.acceleration.x = -this.maxAcceleration;
        if(this.acceleration.y > this.maxAcceleration)
            this.acceleration.y = this.maxAcceleration;
        if(this.acceleration.y < -this.maxAcceleration)
            this.acceleration.y = -this.maxAcceleration;

        // Update the position
        this.position.x += this.acceleration.x * deltaTime;
        this.position.y += this.acceleration.y * deltaTime;
    }

    /**
     * Responsible for drawing the movable.
     * @param ctx The context that the movable is drawn to.
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.position.x + this.radius, this.position.y);
        ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            360,
            false
        );
    }

    public getID() {
        return this.id;
    }

    public getAccelerationRate(): number {
        return this.accelerationRate;
    }

    public getDecelerationRate(): number {
        return this.decelerationRate;
    }

    public getPosition(): Vector {
        return this.position;
    }

    public setPosition(position: Vector)
    {
        this.position = position;
    }

    public getAcceleration(): Vector {
        return this.acceleration;
    }

    public getRadius(): number {
        return this.radius;
    }

    public getMaxAccerleration(): number {
        return this.maxAcceleration;
    }

    public getHealthPoints(): number {
        return this.healthPoints;
    }

    public setHealthPoints(hp: number) {
        this.healthPoints = hp;
    }

    public toString(): string {
        return "Pos: " + this.position.toString() + " Accel: " + this.acceleration.toString();
    }
}

export { Movable };