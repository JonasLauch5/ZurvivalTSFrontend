class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Formats the Vector as a readable string.
     */
    public toString() : string {
        return "( " + this.x + " | " + this.y + " )";
    }

    public static copy(v: Vector): Vector {
        return new Vector(v.x, v.y);
    }
}

export { Vector };