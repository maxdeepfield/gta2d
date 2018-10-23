class Zavod {
    constructor(data,that) {
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];

        this.zavod = that.add.sprite(this.x, this.y, 'zavod').setOrigin(0.5, 0.5).setDepth(2);
        this.zavod.setInteractive();
        let zavod = this.zavod;
        this.zavod.on('pointerdown', function (pointer) {
            if (pointer.buttons === 2) {
                let menu = [
                    {
                        text: 'New Drone',
                        handler: function (x, y) {
                            socket.emit('drone',{x:x,y:y});
                        }
                    },
                    {
                        text: 'Destroy Zavod',
                        handler: function (x, y) {
                            zavod.destroy();
                        }
                    }
                ];
                //TODO addPositionMenu(pointer.position.x, pointer.position.y, pointer.worldX, pointer.worldY, menu);
            }
        });
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.w = data[3];
        this.h = data[4];
    }

    destroy() {
        this.zavod.destroy();
    }
}

export default Zavod;