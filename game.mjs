
//const gameloop = require('node-gameloop');
import gameloop from 'node-gameloop';
import express from 'express';
import http from 'http';
import io from 'socket.io';

import Fly from "./fly";
import Drone from "./drone";
import Tree from "./tree";
import Wall from './wall';
import Player from './player';
import Bullet from './bullet';
import Zavod from './zavod';
import Floor from './floor';
import SAT from 'sat';

import Utils from './utils';
const randomInt = Utils.randomInt;
const randomFloat = Utils.randomFloat;
const distance = Utils.distance;
const radians = Utils.radians;
const degrees = Utils.degrees;
const log = Utils.log;

const app = express();
const server = http.Server(app);
const ios = io(server);

const HOST = '0.0.0.0';
const PORT = 80;

app.use(express.static('public'));
server.listen(PORT);

log('http://localhost:' + PORT);
class Game {
    constructor(options) {
        this.w = options.w || 100000;
        this.h = options.h || 100000;

        this.players = new Map();
        this.players.count = 0;
        this.bullets = new Map();
        this.bullets.count = 0;
        this.walls = new Map();
        this.walls.count = 0;
        this.trees = new Map();
        this.trees.count = 0;
        this.flys = new Map();
        this.flys.count = 0;
        this.drones = new Map();
        this.drones.count = 0;
        this.zavods = new Map();
        this.zavods.count = 0;
        this.floors = new Map();
        this.floors.count = 0;
    }
    emitPlayerList(){
        let p = [];
        this.players.forEach(function(player){
            player.update();
            p.push([player.id,player.name,player.hp,player.kills,player.score]);
        });
        this.emitAll('player_list',p);
    }
    emitWalls(socket){
        let items = [];
        this.walls.forEach(function(item){
            items.push([item.id,item.x,item.y,item.w,item.h]);
        });
        if (socket) {
            socket.emit('walls',items);
        } else {
            this.emitAll('walls', items);
        }
    }
    emitZavods(socket){
        let items = [];
        this.zavods.forEach(function(item){
            items.push([item.id,item.x,item.y,item.w,item.h]);
        });
        if (socket) {
            socket.emit('zavods',items);
        } else {
            this.emitAll('zavods', items);
        }
    }
    emitFloors(socket){
        let items = [];
        this.floors.forEach(function(item){
            items.push([item.id,item.x,item.y,item.w,item.h,item.type]);
        });
        if (socket) {
            socket.emit('floors',items);
        } else {
            this.emitAll('floors', items);
        }
    }
    emitTrees(socket){
        let items = [];
        this.trees.forEach(function(item){
            items.push([item.id,item.x,item.y,item.scale,item.angle]);
        });
        if (socket) {
            socket.emit('trees',items);
        } else {
            this.emitAll('trees', items);
        }
    }
    emitWorld(socket){
        let world= {
            w: this.w,
            h: this.h
        };
        if (socket) {
            socket.emit('world',world);
        } else {
            this.emitAll('world', world);
        }
    }
    start() {
        let that = this;

        ios.on('connection', function (socket) {

            let player = new Player({
                id: ++that.players.count,
                socket_id: socket.id,
                x: randomInt(5000, 5500),
                y: randomInt(5000, 5500),
                vx: 0,
                vy: 0,
                w: 76*2,
                h: 76*2,

                
                hp: 100,
                score: 0,
                kills: 0,

                speed: 0,
                angle: 0,
                radius: 0,
                lookangle: 0,
                mouse: [0, 0],
                pointer: [0, 0],
                buttons: 0,
                keys: { left: false,right: false,up: false,down: false,e: false,q: false,i: false,g: false,m: false,b: false,space: false,enter: false }
            });
            player.ox = player.x;
            player.oy = player.y;
            player.on('fire', function() {
                let bullet = new Bullet({
                    id: ++that.bullets.count,
                    player_id: player.id,
                    parent_id: player.id,
                    damage: randomInt(3,12),
                    x: player.x,
                    y: player.y,
                    angle: player.shoot_angle,
                    speed: 14
                });
                bullet.ox = player.x;
                bullet.oy = player.y;
                that.bullets.set(bullet.id, bullet);
                bullet.on('destroy', function() {//todo leave follen bullets in client on map to make mess
                    that.bullets.delete(bullet.id);
                });
                that.drones.forEach(function (drone) {
                    if (drone.player_id === player.id) {
                        let bullet = new Bullet({
                            id: ++that.bullets.count,
                            player_id: player.id,
                            parent_id: drone.id,
                            damage: randomInt(3,12),
                            x: drone.x,
                            y: drone.y,
                            angle: drone.shoot_angle,
                            speed: 14
                        });
                        bullet.ox = drone.x;
                        bullet.oy = drone.y;
                        that.bullets.set(bullet.id, bullet);
                        bullet.on('destroy', function() {
                            that.bullets.delete(bullet.id);
                        });
                    }
                });
            });
            player.on('destroy', function() {
                that.drones.forEach(function (drone) {
                   if (drone.player_id === player.id) {
                       //drone.destroy();
                   }
                });
                that.players.delete(player.id);
            });

            that.players.set(player.id, player);
            socket.player = player;

            that.emitAll('msg', socket.player.name + ' connected');

            socket.emit('id', player.id);
            that.emitWorld(socket);
            that.emitWalls(socket);
            that.emitZavods(socket);
            that.emitFloors(socket);
            that.emitTrees(socket);
            that.emitPlayerList();

            socket.on('state', function (state) {
                socket.player.mouse = [state[0],state[1]];
                socket.player.buttons = state[2];
                socket.player.keys = {
                    left: Boolean(state[3]),
                    right: Boolean(state[4]),
                    up: Boolean(state[5]),
                    down: Boolean(state[6])
                };
                socket.player.pointer = [state[7],state[8]];
            });

            socket.on('rename', function (name) {
                that.emitAll('msg', socket.player.name + ' changed name to ' + name);
                socket.player.name = name;
                that.emitPlayerList();
            });

            socket.on('msg', function (msg) {
                msg = socket.player.name+': '+msg;
                socket.broadcast.emit('msg', msg);
                socket.emit('msg', msg);
            });

            socket.on('wall', function (data) {
                let wall = new Wall({
                    id: ++that.walls.count,
                    x: data.x,
                    y: data.y,
                    w: data.w,
                    h: data.h
                });
                that.walls.set(wall.id, wall);
                wall.on('destroy', function() {
                    that.walls.delete(wall.id);
                });
                that.emitWalls();
            });

            socket.on('zavod', function (data) {
                let zavod = new Zavod({
                    id: ++that.zavods.count,
                    x: data.x,
                    y: data.y
                });
                that.zavods.set(zavod.id, zavod);
                zavod.on('create', function() {
                   console.log('created zavod',JSON.stringify(zavod));
                });
                zavod.on('destroy', function() {
                    that.zavods.delete(zavod.id);
                });
                that.emitZavods();
            });

            socket.on('floor', function (data) {
                let floor = new Floor({
                    id: ++that.floors.count,
                    x: data.x,
                    y: data.y,
                    w: data.w,
                    h: data.h,
                    type: data.type
                });
                that.floors.set(floor.id, floor);
                floor.on('create', function() {
                   console.log('created floor',JSON.stringify(floor));
                });
                floor.on('destroy', function() {
                    that.floors.delete(floor.id);
                });
                that.emitFloors();
            });

            socket.on('tree', function (data) {
                let tree = new Tree({
                    id: ++that.trees.count,
                    x: data.x,
                    y: data.y,
                    scale: data.scale,
                    angle: data.angle
                });
                that.trees.set(tree.id, tree);
                tree.on('destroy', function() {
                    that.trees.delete(tree.id);
                });
                that.emitTrees();
            });

            socket.on('fly', function (data) {
                let fly = new Fly({
                    id: ++that.flys.count,
                    player_id: player.id,
                    hp: 1000,
                    x: player.x,
                    y: player.y,
                    tx: data.x,
                    ty: data.y
                });
                that.flys.set(fly.id, fly);
                fly.on('destroy', function() {
                    that.flys.delete(fly.id);
                });
            });

            socket.on('drone', function (data) {
                let drone = new Drone({
                    id: ++that.drones.count,
                    player_id: player.id,
                    hp: 100,
                    x: player.x,
                    y: player.y,
                    tx: data.x,
                    ty: data.y,
                    speed: 2,
                    w: 50*2,
                    h: 50*2,

                    score: 0,
                    kills: 0,

                    angle: 0,
                    radius: 0,
                    lookangle: 0,
                    mouse: [0, 0],
                    look: [0, 0],
                });
                drone.ox = drone.x;
                drone.oy = drone.y;
                that.drones.set(drone.id, drone);
                drone.on('destroy', function() {
                    that.drones.delete(drone.id);
                });
            });

            socket.on('disconnect', function () {
                that.emitAll('msg', socket.player.name + ' disconected');
                that.players.delete(socket.player.id);
                socket.player.destroy();
                that.emitPlayerList();
            });
        });

        gameloop.setGameLoop(function () {
            that.update();
        }, 1000 / 60);
    }
    emitAll(x,data){
        Object.keys(ios.sockets.connected).forEach(function (socketID) {
            let socket = ios.sockets.connected[socketID];
            socket.emit(x, data);
        });
    }
    rotatePoint(pivot, point, angle) {
        angle = radians(angle);
        let x = Math.round((Math.cos(angle) * (point[0] - pivot[0])) -
            (Math.sin(angle) * (point[1] - pivot[1])) +
            pivot[0]),
            y = Math.round((Math.sin(angle) * (point[0] - pivot[0])) +
                (Math.cos(angle) * (point[1] - pivot[1])) +
                pivot[1]);
        return [x, y];
    }
    isPointInPoly(point, vs) {
        let x = point[0], y = point[1];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1];
            let xj = vs[j][0], yj = vs[j][1];
            let intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    intersects(p0,p1,p2,p3) {
        var unknownA = (p3.x-p2.x) * (p0.y-p2.y) - (p3.y-p2.y) * (p0.x-p2.x);
        var unknownB = (p1.x-p0.x) * (p0.y-p2.y) - (p1.y-p0.y) * (p0.x-p2.x);
        var denominator = (p3.y-p2.y) * (p1.x-p0.x) - (p3.x-p2.x) * (p1.y-p0.y);
        if (unknownA===0 && unknownB===0 && denominator===0) return null;
        if (denominator===0) return null;
        unknownA /= denominator;
        unknownB /= denominator;
        var isIntersecting=(unknownA>=0 && unknownA<=1 && unknownB>=0 && unknownB<=1);
        if (!isIntersecting) return null;
        return({
            x: p0.x + unknownA * (p1.x-p0.x),
            y: p0.y + unknownA * (p1.y-p0.y)
        });
    }

    update() {
        let that = this;






        that.bullets.forEach(function (bullet) {
            that.players.forEach(function (player,player_id) {
                if (bullet.parent_id !== player_id) {
                    if (distance(player.x,player.y,bullet.x,bullet.y) < 42) {

                        that.emitAll('hit',[bullet.x,bullet.y,bullet.damage]);

                        player.hp -= bullet.damage;
                        that.players.get(bullet.player_id).score+=bullet.damage;
                        if (player.hp <=0) {
                            that.emitAll('boom',[player.x,player.y]);

                            player.x = player.ox+randomInt(100, 500);
                            player.y = player.oy+randomInt(100, 500);
                            player.hp = 100;
                            that.players.get(bullet.player_id).kills++;
                            that.emitAll('msg', player.name + ' is killed by ' + that.players.get(bullet.player_id).name);

                        }
                        bullet.destroy();
                        that.emitPlayerList();
                    }
                }
            });
            that.drones.forEach(function (drone,drone_id) {
                if (bullet.parent_id !== drone_id) {
                    if (distance(drone.x,drone.y,bullet.x,bullet.y) < 32) {

                        that.emitAll('hit',[bullet.x,bullet.y,bullet.damage]);

                        drone.hp -= bullet.damage;
                        that.players.get(bullet.player_id).score+=bullet.damage;
                        if (drone.hp <=0) {
                            that.emitAll('boom',[drone.x,drone.y]);

                            drone.x = drone.ox+randomInt(100, 500);
                            drone.y = drone.oy+randomInt(100, 500);
                            drone.hp = 100;
                            that.players.get(bullet.player_id).kills++;

                        }
                        bullet.destroy();
                        that.emitPlayerList();
                    }
                }
            });
            that.walls.forEach(function (wall) {
                if (distance(bullet.x,bullet.y,wall.x,wall.y) < 64) {
                    bullet.destroy();
                    that.emitAll('hit',[bullet.x,bullet.y,0]);
                }
            });
        });

        let p = [];
        this.players.forEach(function(player){
            player.update();
            that.walls.forEach(function(wall){
                var V = SAT.Vector;
                var P = SAT.Polygon;

                var polygon1 = new P(
                    new V(player.x-player.w/2,player.y-player.h/2), [
                        new V(player.x-player.w/2,player.y-player.h/2),
                        new V(player.x+player.w/2,player.y-player.h/2),
                        new V(player.x+player.w/2,player.y+player.h/2),
                        new V(player.x-player.w/2,player.y+player.h/2)
                ]);
                var polygon2 = new P(
                    new V(wall.x-wall.w/2+20,wall.y-wall.h/2+20), [
                        new V(wall.x-wall.w/2+20,wall.y-wall.h/2+20),
                        new V(wall.x+wall.w/2+20,wall.y-wall.h/2+20),
                        new V(wall.x+wall.w/2+20,wall.y+wall.h/2+20),
                        new V(wall.x-wall.w/2+20,wall.y+wall.h/2+20)
                ]);

                var response = new SAT.Response();
                var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

                if (collided) {
                    player.x = player.x - response.overlapV.x;
                    player.y = player.y - response.overlapV.y;
                }
            });
            that.players.forEach(function(player2){

                if (player.id !== player2.id) {
                    var V = SAT.Vector;
                    var P = SAT.Polygon;

                    var polygon1 = new P(
                        new V(player.x - player.w / 2, player.y - player.h / 2), [
                            new V(player.x - player.w / 2, player.y - player.h / 2),
                            new V(player.x + player.w / 2, player.y - player.h / 2),
                            new V(player.x + player.w / 2, player.y + player.h / 2),
                            new V(player.x - player.w / 2, player.y + player.h / 2)
                        ]);
                    var polygon2 = new P(
                        new V(player2.x - player2.w / 2, player2.y - player2.h / 2), [
                            new V(player2.x - player2.w / 2, player2.y - player2.h / 2),
                            new V(player2.x + player2.w / 2, player2.y - player2.h / 2),
                            new V(player2.x + player2.w / 2, player2.y + player2.h / 2),
                            new V(player2.x - player2.w / 2, player2.y + player2.h / 2)
                        ]);

                    var response = new SAT.Response();
                    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

                    if (collided) {
                        player.x = player.x - response.overlapV.x;
                        player.y = player.y - response.overlapV.y;
                    }
                }
            });
            that.drones.forEach(function(drone){

                    var V = SAT.Vector;
                    var P = SAT.Polygon;

                    var polygon1 = new P(
                        new V(drone.x - drone.w / 2, drone.y - drone.h / 2), [
                            new V(drone.x - drone.w / 2, drone.y - drone.h / 2),
                            new V(drone.x + drone.w / 2, drone.y - drone.h / 2),
                            new V(drone.x + drone.w / 2, drone.y + drone.h / 2),
                            new V(drone.x - drone.w / 2, drone.y + drone.h / 2)
                        ]);
                    var polygon2 = new P(
                        new V(player.x - player.w / 2, player.y - player.h / 2), [
                            new V(player.x - player.w / 2, player.y - player.h / 2),
                            new V(player.x + player.w / 2, player.y - player.h / 2),
                            new V(player.x + player.w / 2, player.y + player.h / 2),
                            new V(player.x - player.w / 2, player.y + player.h / 2)
                        ]);

                    var response = new SAT.Response();
                    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

                    if (collided) {
                        drone.x = drone.x - response.overlapV.x;
                        drone.y = drone.y - response.overlapV.y;
                    }
            });

            p.push([player.id,player.x,player.y,player.angle,player.lookangle,player.mouse[0],player.mouse[1],player.hp,player.score,Math.round(player.radius),player.kills]);
        });
        let b = [];
        this.bullets.forEach(function(bullet){
            bullet.update();
            b.push([bullet.id,bullet.x,bullet.y,bullet.angle]);
        });
        let f = [];
        this.flys.forEach(function(fly){
            let player = that.players.get(fly.player_id);
            if (player) {
                fly.tx = player.mouse[0];
                fly.ty = player.mouse[1];
                if (distance(fly.x,fly.y,fly.tx,fly.ty) < 50) {//todo change if move mouse? nahuj etih botav na mishiko???!?????
                    fly.defend = true;
                } else {
                    fly.defend = false;
                    fly.defendPoly = false;
                }
            } else {
                fly.defend = true;
            }
            fly.update();
            f.push([fly.id,fly.x,fly.y,fly.angle]);
        });
        let d = [];
        this.drones.forEach(function(drone){

            that.drones.forEach(function(drone2){

                if (drone.id !== drone2.id) {
                    var V = SAT.Vector;
                    var P = SAT.Polygon;

                    var polygon1 = new P(
                        new V(drone.x - drone.w / 2, drone.y - drone.h / 2), [
                            new V(drone.x - drone.w / 2, drone.y - drone.h / 2),
                            new V(drone.x + drone.w / 2, drone.y - drone.h / 2),
                            new V(drone.x + drone.w / 2, drone.y + drone.h / 2),
                            new V(drone.x - drone.w / 2, drone.y + drone.h / 2)
                        ]);
                    var polygon2 = new P(
                        new V(drone2.x - drone2.w / 2, drone2.y - drone2.h / 2), [
                            new V(drone2.x - drone2.w / 2, drone2.y - drone2.h / 2),
                            new V(drone2.x + drone2.w / 2, drone2.y - drone2.h / 2),
                            new V(drone2.x + drone2.w / 2, drone2.y + drone2.h / 2),
                            new V(drone2.x - drone2.w / 2, drone2.y + drone2.h / 2)
                        ]);

                    var response = new SAT.Response();
                    var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);

                    if (collided) {
                        drone.x = drone.x - response.overlapV.x;
                        drone.y = drone.y - response.overlapV.y;
                    }
                }
            });
            
            let player = that.players.get(drone.player_id);
            if (player) {
            drone.look = player.mouse;
            if (distance(drone.x,drone.y,drone.tx,drone.ty) < 50) {
                drone.defend = true;
            } else {
                drone.defend = false;
                drone.defendPoly = false;
            }
            } else {
                drone.defend = true;
            }
            drone.update();
            d.push([drone.id,drone.x,drone.y,drone.angle,drone.lookangle,drone.look[0],drone.look[1],drone.hp,drone.score,Math.round(drone.radius),drone.kills]);
        });

        Object.keys(ios.sockets.connected).forEach(function (socketID) {
            let socket = ios.sockets.connected[socketID];
            socket.emit('players', p);
            socket.emit('bullets', b);
            socket.emit('flys', f);
            socket.emit('drones', d);
        });
    }
}

export default Game;