import UI from './scenes/ui.js';
import World from "./scenes/world.js";

import Tree from './game/tree.js';
import Zavod from './game/zavod.js';
import Player from './game/player.js';
import Drone from './game/drone.js';
import Bullet from './game/bullet.js';
import Wall from './game/wall.js';
import Floor from './game/floor.js';
import Fly from './game/fly.js';
import Utils from './game/utils.js';

import Menu from './game/menu.js';

class Game {
    constructor(options) {
        options = options || {};
        this.api = options.api || '/';

        this.w = 500;
        this.h = 500;

        this.players = new Map();
        this.bullets = new Map();
        this.flys = new Map();
        this.drones = new Map();
        this.trees = new Map();
        this.walls = new Map();
        this.zavods = new Map();
        this.floors = new Map();

        this.ui = new UI();
        this.world = new World();
        this.world.ui = this.ui;

        this.my_player = { id: null };
        this.keys = null;

        this.game = new Phaser.Game({
            type: Phaser.WEBGL,
            parent: 'phaser-example',
            width: window.innerWidth,
            height: window.innerHeight,
            scene: [this.world, this.ui]
        });

        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        let that = this;

        setTimeout(function () {
            that.socket = io.connect(this.api);

            that.world.input.mouse.capture = true;
            that.keys = Utils.getKeys(that.world.input);
            that.ui.socket = that.socket;
            that.world.socket = that.socket;
            that.world.ui = that.ui;
            that.ui.set_input(that.world.input);


            ////////////////////////////////////////////////////////////////////////////////////////////
            that.socket.on('id', function (id) {
                that.my_player.id = id;
            });
            that.socket.on('world', function (world) {
                //TODO wait for this like "connecing","getting id","loading world"
                // that.w = world.w;
                // that.h = world.h;//to create new scene? ui before....
            });
            that.socket.on('player_list', function (data) {
                let player_list = data;
                let text = '';
                for (let i = 0; i < player_list.length; i++) {
                    let row = player_list[i][1] + ' | ' + player_list[i][2] + ' hp | ' + player_list[i][3] + ' frg | ' + player_list[i][4] + ' exp | ' + player_list[i][5] + ' lvl\n';
                    text += row;
                    if (player_list[i][0] === that.my_player.id) {
                        that.my_player.name = player_list[i][1];
                        that.ui.br.setText(row.split(' | ').join('\n'));
                    }

                    let player = that.players.get(player_list[i][0]);
                    if (player) {
                        player.setName(player_list[i][1]);
                    }
                }
                that.ui.tl.setText(text);
            });
            ////////////////////////////////////////////////////////////////////////////////////////////
            that.socket.on('hit', function (hit) {
                let x = that.world.add.sprite(hit[0], hit[1], 'hit1').setOrigin(0.5, 0.5).setScale(0.3, 0.3);
                let y = that.world.add.text(hit[0], hit[1] - 30, '-' + hit[2], {
                    font: "20px Arial",
                    fill: "#FFFFFF",
                    align: "center"
                }).setOrigin(0.5, 0.5);
                setTimeout(function () {
                    x.destroy();
                }, 84);
                setTimeout(function () {
                    y.destroy();
                }, 384);
            });
            ////////////////////////////////////////////////////////////////////////////////////////////
            that.socket.on('boom', function (boom) {
                let x = that.world.add.sprite(boom[0], boom[1], 'boom').setOrigin(0.5, 0.5).setScale(0.9, 0.9);
                setTimeout(function () {
                    x.destroy();
                    x = that.world.add.sprite(boom[0], boom[1], 'hit2').setOrigin(0.5, 0.5).setScale(1.9, 1.9);
                    setTimeout(function () {
                        x.destroy();
                        x = that.world.add.sprite(boom[0], boom[1], 'hit3').setOrigin(0.5, 0.5).setScale(0.9, 0.9);
                        setTimeout(function () {
                            x.destroy();
                            x = that.world.add.sprite(boom[0], boom[1], 'hit1').setOrigin(0.5, 0.5).setScale(0.9, 0.9);
                            setTimeout(function () {
                                x.destroy();
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            });
            that.socket.on('msg', function (data) {
                that.ui.console_add(data);
            });
            ////////////////////////////////////////////////////////////////////////////////////////////
            that.socket.on('players', function (data) {
                that.update_game_item(Player, that.players, data, false, function (player) {
                    if (that.my_player.id === player.id) {
                        that.my_player = player;
                        that.world.cameras.main.startFollow(player.actor, true, 0.05, 0.05);
                    }
                })
            });
            that.socket.on('drones', function (data) {
                that.update_game_item(Drone, that.drones, data)
            });
            that.socket.on('flys', function (data) {
                that.update_game_item(Fly, that.flys, data)
            });
            that.socket.on('trees', function (data) {
                that.update_game_item(Tree, that.trees, data)
            });
            that.socket.on('zavods', function (data) {
                that.update_game_item(Zavod, that.zavods, data)
            });
            that.socket.on('bullets', function (data) {
                that.update_game_item(Bullet, that.bullets, data)
            });
            that.socket.on('floors', function (data) {
                that.update_game_item(Floor, that.floors, data)
            });
            ////////////////////////////////////////////////////////////////////////////////////////////
            setInterval(function () {
                if (that.world.input.mousePointer && that.world.input.mousePointer.event && that.world.input.activePointer && that.world.cameras.main.midPoint) {
                    that.socket.emit('state', [
                        that.world.cameras.main.midPoint.x + that.world.input.activePointer.x - window.innerWidth / 2,
                        that.world.cameras.main.midPoint.y + that.world.input.activePointer.y - window.innerHeight / 2,
                        that.world.input.mousePointer.event.buttons,
                        Number(that.keys.left.isDown),
                        Number(that.keys.right.isDown),
                        Number(that.keys.up.isDown),
                        Number(that.keys.down.isDown),
                        that.world.input.mousePointer.position.x,
                        that.world.input.mousePointer.position.y
                    ]);
                }
            }, 15);
        }, 1500);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    update_game_item(Creator, store, data, cb, crcb) {
        let that = this;
        let found = {};
        data.forEach(function (item) {
            found[item[0]] = true;
        });
        for (let item of store) {
            //       console.log(item);
            if (!found[item.id]) {
                // item.destroy();todo wtf here [12,Player] etc
                store.delete(item.id);
            }
        }
        for (let i = 0; i < data.length; i++) {
            let id = data[i][0];
            let item = store.get(id);
            if (item) {
                item.update(data[i]);
            } else {
                item = new Creator(data[i], that.world);
                store.set(id, item);
                if (crcb) {
                    crcb(item);
                }
            }
            if (cb) {
                cb(item);
            }
        }
    }
}

export default Game;