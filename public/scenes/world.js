import Menu from '../game/menu.js';

let World = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function World(config) {
        Phaser.Scene.call(this, {key: 'world', active: true});
        this.menu = null;
    },
    preload: function () {

        this.load.image('tile_grass', 'assets/pack/tileGrass1.png');
    },

    create: function () {
        let world = this;
        world.flooring = false;

        let bg = this.add.tileSprite(0, 0, 10000, 10000, 'tile_grass').setDepth(-2).setOrigin(0);
        // bg.setPipeline('Light2D');
        // this.light  = this.lights.addLight(0, 0, 200).setScrollFactor(0.0).setIntensity(2);
        // this.lights.enable().setAmbientColor(0x555555);
        //

        this.cameras.main.setBounds(0, 0, 10000, 10000);

        this.input.on('pointerdown', function (pointer) {
            if (pointer.buttons === 1) {
                if (world.menu) {
                    world.menu.destroy();
                    world.menu = null;
                }
            }
            if (pointer.buttons === 2) {
                let items = [
                    {
                        text: 'Build',
                        handler: function (x, y) {
                            let items = [
                                {
                                    text: 'Tree',
                                    handler: function (x, y) {
                                        world.socket.emit('tree', {
                                            x: x,
                                            y: y,
                                            scale: 0.4 + Math.random(),
                                            angle: (1 + Math.random()) * 50
                                        });
                                        world.menu.destroy();
                                        world.menu = null;
                                    }
                                },
                                {
                                    text: 'Zavod',
                                    handler: function (x, y) {
                                        world.socket.emit('zavod', {x: x, y: y});
                                        world.menu.destroy();
                                        world.menu = null;
                                    }
                                }
                            ];
                            if (world.menu) {
                                world.menu.destroy();
                                world.menu = null;
                            }
                            world.menu = new Menu({
                                x: pointer.event.x,
                                y: pointer.event.y,
                                wx: x,
                                wy: y,
                                world: world,
                                items: items
                            });
                        }
                    },
                    {
                        text: 'Fly',
                        handler: function (x, y) {
                            world.socket.emit('fly', {x: x, y: y});
                            world.menu.destroy();
                            world.menu = null;
                        }
                    },
                    {
                        text: 'Drone',
                        handler: function (x, y) {
                            let i;
                            for (i = 1; i < 2; i++) {
                                world.socket.emit('drone', {x: x + i * 70, y: y + i * 70});

                            }
                            world.menu.destroy();
                            world.menu = null;
                        }
                    },
                    {
                        text: 'Wall',
                        handler: function (x, y) {
                            world.socket.emit('wall', {x: x, y: y, w: 256, h: 256});
                            world.menu.destroy();
                            world.menu = null;
                        }
                    },
                    {
                        text: 'Floor',//todo other spawned items alwo pre draw where theu weill be located! (this is X mark but draw image too. how to position on first crate thn?)
                        handler: function (x, y) {

                            world.flooring = true;
                            world.flooring_tile = world.add.sprite(0, 0, 'tile_white').setOrigin(0, 0).setDepth(-1.5);
                            world.flooring_pointermove = function (pointer) {
                                function snapToGrid(val) {
                                    let gridSize = 128;
                                    return gridSize * Math.floor(val / gridSize);
                                }

                                world.flooring_tile.x = snapToGrid(pointer.worldX);
                                world.flooring_tile.y = snapToGrid(pointer.worldY);
                            };
                            world.flooring_pointerdown = function (pointer) {
                                if (pointer.buttons === 1) {
                                    world.socket.emit('floor', {
                                        x: world.flooring_tile.x + 64,
                                        y: world.flooring_tile.y + 64,
                                        h: 128,
                                        w: 128,
                                        type: world.flooring_tile.texture.key
                                    });
                                }
                                if (pointer.buttons === 2) {
                                    world.input.off('pointermove', world.flooring_pointermove);
                                    world.input.off('pointerdown', world.flooring_pointerdown);
                                    world.flooring_tile.destroy();
                                }
                            };
                            world.input.on('pointermove', world.flooring_pointermove);
                            world.input.on('pointerdown', world.flooring_pointerdown);

                            let ui_bg = world.ui.add.sprite(10, 10, 'tile_black').setOrigin(0.5, 0.5);
                            let ui_selector = world.ui.add.sprite(10, 10, 'tile_white').setOrigin(0.5, 0.5).setScale(0.35, 0.35);

                            let items = [
                                {ui:null,image:'tileGrass_roadCornerLR'},
                                {ui:null,image:'tileGrass_roadCornerUL'},
                                {ui:null,image:'tileGrass_roadCornerUR'},
                                {ui:null,image:'tileGrass_roadCrossing'},
                                {ui:null,image:'tileGrass_roadCrossingRound'},
                                {ui:null,image:'tileGrass_roadEast'},
                                {ui:null,image:'tileGrass_roadNorth'},
                                {ui:null,image:'tileGrass_roadSplitE'},
                                {ui:null,image:'tileGrass_roadSplitN'},
                                {ui:null,image:'tileGrass_roadSplitS'},
                                {ui:null,image:'tileSand_roadCornerLR'},
                                {ui:null,image:'tileSand_roadCornerUL'},
                                {ui:null,image:'tileSand_roadCornerUR'},
                                {ui:null,image:'tileSand_roadCrossing'},
                                {ui:null,image:'tileSand_roadCrossingRound'},
                                {ui:null,image:'tileSand_roadEast'},
                                {ui:null,image:'tileSand_roadNorth'},
                                {ui:null,image:'tileSand_roadSplitE'},
                                {ui:null,image:'tileSand_roadSplitN'},
                                {ui:null,image:'tileSand_roadSplitS'},
                                {ui:null,image:'tile_grass'},
                                {ui:null,image:'tile_sand'},
                                {ui:null,image:'tile_brugis'},
                                {ui:null,image:'tile_dirt'},

                                {ui:null,image:'tileGrass_roadTransitionE'},
                                {ui:null,image:'tileGrass_roadTransitionE_dirt'},
                                {ui:null,image:'tileGrass_roadTransitionN'},
                                {ui:null,image:'tileGrass_roadTransitionN_dirt'},
                                {ui:null,image:'tileGrass_roadTransitionS'},
                                {ui:null,image:'tileGrass_roadTransitionS_dirt'},
                                {ui:null,image:'tileGrass_roadTransitionW'},
                                {ui:null,image:'tileGrass_roadTransitionW_dirt'},
                                {ui:null,image:'tileGrass_transitionE'},
                                {ui:null,image:'tileGrass_transitionN'},
                                {ui:null,image:'tileGrass_transitionS'},
                                {ui:null,image:'tileGrass_transitionW'},
                                
                            ];

                            let item_with = 40;
                            let posx = window.innerWidth / 2 - (items.length * item_with) / 2;
                            let posy = window.innerHeight - 40;
                            ui_bg.x = window.innerWidth / 2;
                            ui_bg.y = window.innerHeight - 40;

                            ui_bg.setScale(100/128*10,0.4);

                            let first = false;
                            items.forEach(function (item) {
                                item.ui = world.ui.add.sprite(10, 10, item.image).setOrigin(0.5, 0.5).setScale(0.3, 0.3);
                                item.ui.x = posx;
                                item.ui.y = posy;
                                item.ui.setInteractive();
                                item.ui.on('pointerover', function () {
                                    ui_selector.x = item.ui.x;
                                    ui_selector.y = item.ui.y;
                                });
                                item.ui.on('pointerdown', function () {
                                    world.flooring_tile.setTexture(item.ui.texture.key);
                                });
                                if (!first) {
                                    ui_selector.x = item.ui.x;
                                    ui_selector.y = item.ui.y;
                                    world.flooring_tile.setTexture(item.ui.texture.key);
                                    first = true;
                                }
                                posx += item_with;
                            });

                            if (world.menu) {
                                world.menu.destroy();
                                world.menu = null;
                            }
                            world.menu = new Menu({
                                x: pointer.event.x,
                                y: pointer.event.y,
                                wx: x,
                                wy: y,
                                world: world,
                                items: items
                            });


                        }
                    }
                ];
                if (world.menu) {
                    world.menu.destroy();
                    world.menu = null;
                }
                world.menu = new Menu({
                    x: pointer.event.x,
                    y: pointer.event.y,
                    wx: pointer.worldX,
                    wy: pointer.worldY,
                    world: world,
                    items: items
                });
            }
        });

    },
    update() {
        if (this.menu) {
            this.menu.update();
        }
    }
});

export default World;