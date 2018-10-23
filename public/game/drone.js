import Menu from '../game/menu.js';

class Drone {
    constructor(data,that) {
        let me = this;
        let world = that;
        this.that = that;
        this.id = data[0];
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;
        this.lookangle = data[4];
        this.mouse = [data[5], data[6]];
        this.hp = data[7];
        this.score = data[8];
        this.radius = data[9];
        this.kills = data[10];

        this.actor = that.add.sprite(this.x, this.y, 'tank_blue').setOrigin(0.5, 0.5).setScale(0.6,0.6);
        this.actor.setInteractive();
        this.menu = null;
        this.actor.on('pointerdown', function (pointer,x,y,event) {
            event.stopPropagation();
            if (pointer.buttons === 1) {
                if (me.menu) {
                    me.menu.destroy();
                    me.menu = null;
                }
            }
            if (pointer.buttons === 2) {
                let items = [
                    {
                        text: 'Follow me',
                        handler: function (x, y) {
                            me.menu.destroy();
                            me.menu = null;
                        }
                    },
                    {
                        text: 'Defend...',
                        handler: function (x, y) {
                            world.input.once('pointerdown', function (pointer) {
                                me.tx = pointer.worldX;//todo ololo send to server!
                                me.ty = pointer.worldY;
                            });
                            me.menu.destroy();
                            me.menu = null;
                        }
                    },
                    {
                        text: 'Move to...',
                        handler: function (x, y) {
                            me.menu.destroy();
                            me.menu = null;
                        }
                    },
                    {
                        text: 'Stop',
                        handler: function (x, y) {
                            me.menu.destroy();
                            me.menu = null;
                        }
                    },
                    {
                        text: 'Destroy',
                        handler: function (x, y) {
                            me.menu.destroy();
                            me.menu = null;
                        }
                    }
                ];
                if (me.menu) {
                    me.menu.destroy();
                    me.menu = null;
                }
                me.menu = new Menu({
                    x: pointer.event.x,
                    y: pointer.event.y,
                    wx: me.x,
                    wy: me.y,
                    world: world,
                    items: items
                });
            }
        });
        this.puha = that.add.sprite(this.x, this.y, 'puha').setFlipY(true).setOrigin(0.5, 1).setScale(0.6,0.6);
        this.mouseactor = that.add.sprite(this.x, this.y, 'mouse').setOrigin(0.5, 0.5).setDepth(2);
        this.text = that.add.text(0, 0, '', {
            font: "10px Calibri",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);
    }

    update(data) {
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;
        this.lookangle = data[4];
        this.mouse = [data[5], data[6]];
        this.hp = data[7];
        this.score = data[8];
        this.radius = data[9];
        this.kills = data[10];

        this.actor.x = this.x;
        this.actor.y = this.y;
        this.actor.angle = this.angle;
        this.puha.x = this.x;
        this.puha.y = this.y;
        this.puha.angle = this.lookangle + 90;
        this.mouseactor.x = this.mouse[0];
        this.mouseactor.y = this.mouse[1];

        this.text.setText(this.hp + ' hp | ' + this.kills + ' frg | ' + this.score + ' exp');
        this.text.x = this.x;
        this.text.y = this.y - 50;
        if (this.menu) {
            this.menu.update(this.x,this.y);
        }
    }

    destroy() {
        this.actor.destroy();
        this.puha.destroy();
        this.mouseactor.destroy();
        this.text.destroy();
        this.menu.destroy();
    }
}

export default Drone;