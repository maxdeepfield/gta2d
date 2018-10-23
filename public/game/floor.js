class Floor {
    constructor(data,that) {
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];
        this.type = data[5];
        console.log(this.type);
        this.floor = that.add.sprite(this.x, this.y, this.type).setOrigin(0.5,0.5).setDepth(-1.5);
        this.setSize();
        //this.floor.angle = 45;
    }

    setSize() {
       this.floor.scaleX = this.w/128;
       this.floor.scaleY = this.h/128;
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];
        this.type = data[5];
        this.setSize();
    }

    destroy() {
        this.floor.destroy();
    }
}

export default Floor;