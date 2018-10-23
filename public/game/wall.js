class Wall {
    constructor(data,that) {
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];

        this.wall = that.add.sprite(this.x, this.y, 'wall').setOrigin(0.5, 0.5).setDepth(3);
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];
    }

    destroy() {
        this.wall.destroy();
    }
}

export default Wall;