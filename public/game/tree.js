class Tree {
    constructor(data,that) {
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.scale = data[3];
        this.angle = data[4];

        this.tree = that.add.sprite(this.x, this.y, 'tree').setOrigin(0.5, 0.5).setScale(this.scale).setDepth(4);
        this.tree.angle = this.angle;
        this.that = that;
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.scale = data[3];
        this.angle = data[4];
    }

    destroy() {
        this.tree.destroy();
    }
}
export default Tree;