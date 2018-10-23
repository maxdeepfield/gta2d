import Utils from './utils';
let randomInt =Utils.randomInt;
let randomFloat =Utils.randomFloat;
let distance =Utils.distance;
let radians =Utils.radians;
let degrees =Utils.degrees;
let log =Utils.log;

import EventEmitter from 'events';

class Player extends EventEmitter  {
    constructor(options) {//todo tank.js
        super();
        this.type = 'player';
        this.id = options.id;
        this.hp = options.hp;

        this.x = options.x;//todo width height. inherits "actor" ? :D
        this.y = options.y;
        this.vx = options.vx;
        this.vxo = options.vxo;
        this.vxov = options.vxov;
        this.vy = options.vy;

        this.w = options.w;
        this.h = options.w;

        this.angle = options.angle;
        this.lookangle = options.lookangle;

        this.speed = options.speed;
        this.acc = 0.04;
        this.maxSpeed = 4;//todo backpedal speed

        this.radius = options.radius;
        this.name = options.name || '#'+options.id;

        this.buttons = options.buttons;
        this.mouse = options.mouse;
        this.pointer = options.pointer;
        this.keys = options.keys;

        this.score = options.score;
        this.kills = options.kills;
        this.start = new Date();
        this.lastShoot = new Date();

        this.lastpos = [0,0];

        //todo hp
        //todo respawn date, respawn pos/options
        //todo score

        this.last_pointer = this.pointer;

        this.radius_angle = 0;
        this.shoot_angle = 0;

    }
    update() {

        this.lastpos = [this.x,this.y];

        if (this.buttons === 1) {
            if (new Date() - this.lastShoot > 400) {
                this.emit('fire', 'big');
                this.lastShoot = new Date();
            }
        }

        if (this.last_pointer[0] === this.pointer[0] && this.last_pointer[1] === this.pointer[1]) {
            if (!this.keys.up && !this.keys.down && !this.keys.left && !this.keys.right) {
                //if (new Date()-this.last_pointer_date > 200) {//todo start reduce radious after a while mouse move ends
                    this.radius -= 1;
                //}
            } else {
                this.radius = distance(this.x,this.y,this.mouse[0],this.mouse[1])/4;
            }
        } else {
            this.radius = distance(this.x,this.y,this.mouse[0],this.mouse[1])/4;
        }
        if (this.radius > distance(this.x,this.y,this.mouse[0],this.mouse[1])/4) {
            this.radius = distance(this.x,this.y,this.mouse[0],this.mouse[1])/4;
        }
        this.last_pointer = this.pointer;

        if (this.radius < 5) {
            this.radius = 1;
        }

        if (this.keys.up) {
            this.speed += this.acc;
            if (this.speed > this.maxSpeed) {
                this.speed = this.maxSpeed;
            }
        }

        if (this.keys.down) {
            this.speed -= this.acc;
            if (this.speed < -this.maxSpeed/2) {
                this.speed = -this.maxSpeed/2;
            }
        }

        if (!this.keys.up && !this.keys.down) {
            if (this.speed > 0) {
                this.speed -= this.acc / 2;
            } else
            if (this.speed < 0) {
                this.speed += this.acc / 2;
            } else  {
                this.speed = 0;
            }
        }

        if (this.keys.left) {
            this.angle -= 1;
        }
        if (this.keys.right) {
            this.angle += 1;
        }

        this.vx = Math.cos(radians(this.angle))*this.speed;
        this.vy = Math.sin(radians(this.angle))*this.speed;

        if (this.vxo) {
            this.vx = this.vxov;
        }

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        this.lookangle = Math.atan2(this.mouse[1] - this.y, this.mouse[0] - this.x) * 180 / Math.PI;

        function findNewPoint(x, y, angle, distance) {
            var result = {};
            result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
            result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
            return result;
        }

        var p_max = findNewPoint(this.mouse[0],this.mouse[1],this.lookangle-90,randomFloat(0,this.radius));
        var p_min = findNewPoint(this.mouse[0],this.mouse[1],this.lookangle+90,randomFloat(0,this.radius));
        var p = Math.random()>0.5?p_min:p_max;

        this.shoot_angle = Math.atan2(p.y - this.y, p.x - this.x) * 180 / Math.PI;

    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}


export default Player;