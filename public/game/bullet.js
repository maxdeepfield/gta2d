class Bullet {
    constructor(data,that) {
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;

        this.dot = that.add.sprite(this.x, this.y, 'dot').setOrigin(0.5, 0.5).setDepth(-1);
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;

        this.dot.x = this.x;
        this.dot.y = this.y;
        this.dot.angle = this.angle;
    }

    destroy() {
        this.dot.destroy();
    }
}
export default Bullet;