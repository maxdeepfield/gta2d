class Menu {
    constructor(options) {
        let me = this;
        this.world = options.world;
        this.x = options.x;
        this.y = options.y;
        this.wx = options.wx;
        this.wy = options.wy;
        this.items = options.items;
        let posX = this.x + 10;
        let posY = this.y + 10;
        this.marker = me.world.add.text(this.wx, this.wy, 'x', {font: "30px consolas", fill: "#ffffff"}).setOrigin(0.5,0.5);
        this.bullet = me.world.ui.add.text(posX-10,posY, '-', {font: "30px consolas", fill: "#ffffff"}).setOrigin(0.5,0.5);
        this.menu = [];
        me.items.forEach(function (item) {
            let item_text = me.world.ui.add.text(posX, posY, item.text, {
                font: "14px consolas",
                fill: "#ffffff"
            }).setInteractive();
            posY+=20;
            item_text.on('pointerdown', function () {
                item.handler(me.wx, me.wy);
                me.destroy();
            });
            item_text.on('pointerover', function () {
                me.bullet.y = item_text.y+5;
            });
            me.menu.push(item_text);
        });
    }

    update(wx,wy) {
        if (wx && wy) {
            this.wx = wx;
            this.wy = wy;
        }
        if (this.lines) {
            this.lines.clear();
            this.lines.destroy();
        }
        this.lines = this.world.add.graphics({lineStyle: {color: 0xFFFFFF}});
        this.marker.x = this.wx;
        this.marker.y = this.wy;
        this.line = new Phaser.Geom.Line(
            this.wx,
            this.wy,
            this.world.cameras.main.midPoint.x - window.innerWidth / 2 + this.x,
            this.world.cameras.main.midPoint.y - window.innerHeight / 2 + this.y
        );
        this.lines.strokeLineShape(this.line);
        let me = this;
        setTimeout(function () {
            if (me.lines) {
                me.lines.clear();
                me.lines.destroy();
            }
        }, 100);
    }

    destroy() {
        if (this.marker) {
            this.marker.destroy();
        }
        if (this.menu){
            this.menu.forEach(function (item_text) {
                item_text.destroy();
            });
        }
        if (this.bullet) {
            this.bullet.destroy();
        }
        if (this.lines) {
            this.lines.clear();
            this.lines.destroy();
        }
    }
}

export default Menu;