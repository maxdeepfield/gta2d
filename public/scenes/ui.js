let UI = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function UI(config) {
        Phaser.Scene.call(this, { key: 'ui', active: true });
        this.console = [];
    },

    preload: function () {


        this.load.image('bg', 'assets/grass/grass03.png');
        this.load.image('tank_red', 'assets/pack/tankBody_red.png');
        this.load.image('tank_blue', 'assets/pack/tankBody_blue.png');
        this.load.image('puha', 'assets/pack/tankDark_barrel3.png');
        this.load.image('mouse', 'assets/mouse.png');
        this.load.image('bullet', 'assets/pack/playerShip1_green.png');
        this.load.image('dot', 'assets/pack/bulletSand1.png');
        this.load.image('tree', 'assets/pack/treeGreen_large.png');
        this.load.image('hit1', 'assets/pack/explosion1.png');
        this.load.image('hit2', 'assets/pack/explosion2.png');
        this.load.image('hit3', 'assets/pack/explosion3.png');
        this.load.image('boom', 'assets/pack/explosion4.png');
        this.load.image('wall', 'assets/pack/tileSand1.png');
        this.load.image('zavod', 'assets/zavod.png');
        this.load.image('tank', 'assets/pack/Tanks/tankBeige.png');


        this.load.image('tile_dirt', 'assets/pack/Environment/dirt.png');
        this.load.image('tile_brugis', 'assets/pack/Environment/sand.png');
        this.load.image('tile_sand', 'assets/pack/tileSand1.png');
        this.load.image('tile_white', 'assets/tile_white.png');
        this.load.image('tile_black', 'assets/tile_black.png');
        this.load.image('bg_white', 'assets/bg_white.png');
        this.load.image('bg_black', 'assets/bg_black.png');

        this.load.image('tileGrass_roadCornerLL', 'assets/pack/tileGrass_roadCornerLL.png');
        this.load.image('tileGrass_roadCornerLR', 'assets/pack/tileGrass_roadCornerLR.png');
        this.load.image('tileGrass_roadCornerUL', 'assets/pack/tileGrass_roadCornerUL.png');
        this.load.image('tileGrass_roadCornerUR', 'assets/pack/tileGrass_roadCornerUR.png');
        this.load.image('tileGrass_roadCrossing', 'assets/pack/tileGrass_roadCrossing.png');
        this.load.image('tileGrass_roadCrossingRound', 'assets/pack/tileGrass_roadCrossingRound.png');
        this.load.image('tileGrass_roadEast', 'assets/pack/tileGrass_roadEast.png');
        this.load.image('tileGrass_roadNorth', 'assets/pack/tileGrass_roadNorth.png');
        this.load.image('tileGrass_roadSplitE', 'assets/pack/tileGrass_roadSplitE.png');
        this.load.image('tileGrass_roadSplitN', 'assets/pack/tileGrass_roadSplitN.png');
        this.load.image('tileGrass_roadSplitS', 'assets/pack/tileGrass_roadSplitS.png');
        this.load.image('tileGrass_roadSplitW', 'assets/pack/tileGrass_roadSplitW.png');

        this.load.image('tileSand_roadCornerLL', 'assets/pack/tileSand_roadCornerLL.png');
        this.load.image('tileSand_roadCornerLR', 'assets/pack/tileSand_roadCornerLR.png');
        this.load.image('tileSand_roadCornerUL', 'assets/pack/tileSand_roadCornerUL.png');
        this.load.image('tileSand_roadCornerUR', 'assets/pack/tileSand_roadCornerUR.png');
        this.load.image('tileSand_roadCrossing', 'assets/pack/tileSand_roadCrossing.png');
        this.load.image('tileSand_roadCrossingRound', 'assets/pack/tileSand_roadCrossingRound.png');
        this.load.image('tileSand_roadEast', 'assets/pack/tileSand_roadEast.png');
        this.load.image('tileSand_roadNorth', 'assets/pack/tileSand_roadNorth.png');
        this.load.image('tileSand_roadSplitE', 'assets/pack/tileSand_roadSplitE.png');
        this.load.image('tileSand_roadSplitN', 'assets/pack/tileSand_roadSplitN.png');
        this.load.image('tileSand_roadSplitS', 'assets/pack/tileSand_roadSplitS.png');
        this.load.image('tileSand_roadSplitW', 'assets/pack/tileSand_roadSplitW.png');

        this.load.image('tileGrass_roadTransitionE', 'assets/pack/tileGrass_roadTransitionE.png');
        this.load.image('tileGrass_roadTransitionE_dirt', 'assets/pack/tileGrass_roadTransitionE_dirt.png');
        this.load.image('tileGrass_roadTransitionN', 'assets/pack/tileGrass_roadTransitionN.png');
        this.load.image('tileGrass_roadTransitionN_dirt', 'assets/pack/tileGrass_roadTransitionN_dirt.png');
        this.load.image('tileGrass_roadTransitionS', 'assets/pack/tileGrass_roadTransitionS.png');
        this.load.image('tileGrass_roadTransitionS_dirt', 'assets/pack/tileGrass_roadTransitionS_dirt.png');
        this.load.image('tileGrass_roadTransitionW', 'assets/pack/tileGrass_roadTransitionW.png');
        this.load.image('tileGrass_roadTransitionW_dirt', 'assets/pack/tileGrass_roadTransitionW_dirt.png');
        this.load.image('tileGrass_transitionE', 'assets/pack/tileGrass_transitionE.png');
        this.load.image('tileGrass_transitionN', 'assets/pack/tileGrass_transitionN.png');
        this.load.image('tileGrass_transitionS', 'assets/pack/tileGrass_transitionS.png');
        this.load.image('tileGrass_transitionW', 'assets/pack/tileGrass_transitionW.png');



        this.is_chatting = false;
        this.is_renaming = false;

        this.console = [];

        let me = this;

        this.load.on('progress', function (value) {
            me.console_add('loading textures... '+Math.round(value*100)+' %');
        });
        this.load.on('complete', function () {
            me.console_add('loading textures OK');
        });
    },

    update() {

    },

    create: function () {
        let console_bg = this.add.sprite(10, window.innerHeight-10, 'bg_black').setOrigin(0,1).setScale(250,100);
        let status_bg = this.add.sprite(window.innerWidth-10, window.innerHeight-10, 'bg_black').setOrigin(1,1).setScale(150,100);

        let item_bg = this.add.sprite(270, window.innerHeight-10, 'bg_black').setOrigin(0,1).setScale(window.innerWidth-250-150-10-10-10-10,100);

        let top_bg = this.add.sprite(10, 10, 'bg_black').setOrigin(0,0).setScale(window.innerWidth-20,100);


        this.item_title = this.add.text(273, window.innerHeight-109, 'Player', {
            font: "12px Consolas",
            fill: "#ffffff"
        }).setOrigin(0, 0);

        this.tl = this.add.text(20, 20, 'player list top left', {
            font: "12px Consolas",
            fill: "#ffffff"
        }).setOrigin(0, 0).setInteractive();
        this.tl.on('pointerdown', function (pointer) {
            alert('UI CLICK')
        });


        this.tr = this.add.text(window.innerWidth - 20, 20, 'Drive: WASD\nShoot: Left Mouse\nChange Name: F2\nChat: Enter', {
            align: 'right',
            font: "14px Consolas",
            fill: "#ffffff"
        }).setOrigin(1, 0);

        this.bl = this.add.text(12, window.innerHeight, '', {
            font: "10px Consolas",
            fill: "#ffffff"
        }).setOrigin(0, 1);

        this.br = this.add.text(window.innerWidth - 14, window.innerHeight+12, '', {
            align: 'right',
            font: "17px Consolas",
            fill: "#ffffff"
        }).setOrigin(1, 1);

        this.t = this.add.text(window.innerWidth / 2, 20, '', {
            align: 'center',
            font: "20px Consolas",
            fill: "#ffffff"
        }).setOrigin(0.5, 0);

        this.b = this.add.text(window.innerWidth / 2, window.innerHeight - 20, '', {
            align: 'center',
            font: "20px Consolas",
            fill: "#ffffff"
        }).setOrigin(0.5, 1);

        this.l = this.add.text(20, window.innerHeight / 2, '', {
            align: 'left',
            font: "20px Consolas",
            fill: "#ffffff"
        }).setOrigin(0, 0.5);

        this.r = this.add.text(window.innerWidth - 20, window.innerHeight / 2, '', {
            align: 'right',
            font: "20px Consolas",
            fill: "#ffffff"
        }).setOrigin(1, 0.5);

        this.textfield = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '', {
            font: "30px consolas",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5, 0.5);
        this.textfield.alpha = 0;
        },

    console_add(text){
        this.console.push(text);
        this.console_update();
    },

    console_update(){
        if (this.bl) {
            let len = this.console.length;
            let out = [];
            for (let i = len; i > len - 10; i--) {
                out.push(this.console[i]);
            }
            this.bl.setText(out.reverse().join('\n'));
        }
    },

    set_input(input){
        this.input = input;
        let that = this;
        function ask(what, cb) {
            that.textfield.text = what + ': ';
            that.textfield.alpha = 1;
            let onkeydown = function (event) {
                if (event.keyCode === 27) {
                    that.textfield.alpha = 0;
                    that.world.input.keyboard.off('keydown', onkeydown);
                }
                if (event.keyCode === 13) {
                    that.textfield.alpha = 0;
                    cb(that.textfield.text);
                    that.input.keyboard.off('keydown', onkeydown);
                }
                if (event.keyCode === 8 && that.textfield.text.length > 0) {
                    if (that.textfield.text.length > that.is_renaming ? 10 : 6) {
                        that.textfield.text = that.textfield.text.substr(0, that.textfield.text.length - 1);
                    }
                } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                    that.textfield.text += event.key;
                }
            };
            that.input.keyboard.on('keydown', onkeydown);
        }

        that.input.keyboard.on('keydown', function (event) {
            if (event.keyCode === 113) {
                that.is_renaming = true;
                ask('New Name' + name, function (name) {
                    that.socket.emit('rename', name.substr(10));
                    that.is_renaming = false;
                })
            }
            if (event.keyCode === 13 && that.textfield.alpha === 0) {
                that.is_chatting = true;
                ask('Chat', function (msg) {
                    that.socket.emit('msg', msg.substr(6));
                    that.is_chatting = false;
                })
            }
        });
    }

});

export default UI;