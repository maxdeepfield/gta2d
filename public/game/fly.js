class Fly {
    constructor(data,that) {
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;

        this.dot = that.add.sprite(this.x, this.y, 'dot').setOrigin(0.5, 0.5).setScale(0.3, 0.3);
        this.text = that.add.text(0, 0, 'fly #'+this.id, {
            font: "10px Calibri",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;

        this.dot.x = this.x;
        this.dot.y = this.y;
        this.dot.angle = this.angle;
        this.text.x = this.x;
        this.text.y = this.y - 40;
    }

    destroy() {
        this.dot.destroy();
        this.text.destroy();
    }
}

export default Fly;