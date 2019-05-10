import Menu from '../game/menu.js';

class Player {
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

        this.name = '';

        this.actor = that.add.sprite(this.x, this.y, 'tank').setOrigin(0.5, 0.5).setDepth(1);
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
                        text: 'huj',
                        handler: function (x, y) {
                            let items = [
                                {
                                    text: 'huj 2 ',
                                    handler: function (x, y) {
                                        me.menu.destroy();
                                        me.menu = null;
                                    }
                                },
                                {
                                    text: 'pizda 22',
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
                    },
                    {
                        text: 'pizda',
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

        this.puha = that.add.sprite(this.x, this.y, 'puha').setFlipY(true).setOrigin(0.5, 1).setDepth(1);
        this.mouseactor = that.add.sprite(this.x, this.y, 'mouse').setOrigin(0.5, 0.5).setDepth(2);
        this.text = that.add.text(0, 0, '', {
            font: "12px Calibri",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.poly = that.add.polygon(this.x, this.y, [0,0,0,200,200,200,200,0]);
        console.log(this.poly);
    }
//TODO MENU ENGINE!!!!!!!!!!!!!!!!!! PATOM TEXTURE SHAPES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    setName(name) {
        this.name = name;
    }

    update(data) {
        //audio stereo X filter Y low + high - engine
        this.x = data[1];
        this.y = data[2];
        this.angle = data[3] + 90;
        this.lookangle = data[4];
        this.mouse = [data[5], data[6]];
        this.hp = data[7];
        this.score = data[8];
        this.radius = data[9];
        this.kills = data[10];

        this.poly.x = this.x;
        this.poly.y = this.y;
        this.actor.x = this.x;
        this.actor.y = this.y;
        this.actor.angle = this.angle;
        this.puha.x = this.x;
        this.puha.y = this.y;
        this.puha.angle = this.lookangle + 90;
        this.mouseactor.x = this.mouse[0];
        this.mouseactor.y = this.mouse[1];

        if (this.circles2) {
            this.circles2.clear();
            this.circles2.destroy();
        }
        this.circles2 = this.that.add.graphics({fillStyle: {color: 0xFFFFFF, alpha: 0.5}}).setDepth(1);
        this.circles2.alpha = 1 - this.radius / 300;
        this.circle2 = new Phaser.Geom.Circle(this.mouseactor.x, this.mouseactor.y, this.radius);
        this.circles2.fillCircleShape(this.circle2);
        let huj = this.circles2;
        setTimeout(function () {
            huj.clear();
            huj.destroy();
        }, 100);

        this.text.setText(this.name + ' | ' + this.hp + ' hp | ' + this.kills + ' frg | ' + this.score + ' exp');
        this.text.x = this.x;
        this.text.y = this.y - 50;

        if (this.menu) {
            this.menu.update(this.x,this.y);
        }
    }

    destroy() {
        if (this.actor)
        this.actor.destroy();
        if (this.puha)
        this.puha.destroy();
        if (this.mouseactor)
        this.mouseactor.destroy();
        if (this.text)
        this.text.destroy();
        if (this.menu)
        this.menu.destroy();
    }
}

export default Player;