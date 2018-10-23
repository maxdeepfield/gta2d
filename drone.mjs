import Utils from './utils';
let randomFloat =Utils.randomFloat;
let distance =Utils.distance;
let radians =Utils.radians;

import EventEmitter from 'events';

class Drone extends EventEmitter  {
    constructor(options) {//todo tank.js
        super();
        this.type = 'drone';
        this.player_id = options.player_id;
        this.parent_id = options.parent_id;
        this.id = options.id;
        this.hp = options.hp;

        this.x = options.x;//todo width height. inherits "actor" ? :D
        this.y = options.y;
        this.vx = options.vx;
        this.vy = options.vy;

        this.defend = false;
        this.defendRadius = options.defendRadius || 500;
        this.defendPolyAngles = options.defendPolyAngles || 30;
        this.defendPoly = null;
        this.defendPolyNow = 0;
        this.tx = options.tx;
        this.ty = options.ty;

        this.w = options.w;
        this.h = options.w;

        this.angle = options.angle;
        this.look = [0,0];
        this.lookangle = options.lookangle;

        this.speed = options.speed;
        this.acc = 0.04;
        this.maxSpeed = 4;//todo backpedal speed

        this.radius = options.radius;
        this.name = options.name || '#'+options.id;

        this.score = options.score;
        this.kills = options.kills;
        this.start = new Date();
        this.lastShoot = new Date();
        this.lastpos = [0,0];
        this.last_pointer = this.look;
        this.radius_angle = 0;
        this.shoot_angle = 0;

    }
    update() {
        this.lastpos = [this.x,this.y];

        if (this.buttons === 1) {//todo fire drone?

            if (new Date() - this.lastShoot > 400) {
                this.emit('fire', 'big');
                this.lastShoot = new Date();
            }
        }

        if (this.last_pointer[0] === this.look[0] && this.last_pointer[1] === this.look[1]) {
            this.radius -= 1;
        } else {
            this.radius = distance(this.x,this.y,this.look[0],this.look[1])/4;
        }
        if (this.radius > distance(this.x,this.y,this.look[0],this.look[1])/4) {
            this.radius = distance(this.x,this.y,this.look[0],this.look[1])/4;
        }
        this.last_pointer = this.look;

        if (this.radius < 5) {
            this.radius = 1;
        }

        function rotatePoint(pivot, point, angle) {
            angle = radians(angle);
            let x = Math.round((Math.cos(angle) * (point[0] - pivot[0])) -
                (Math.sin(angle) * (point[1] - pivot[1])) +
                pivot[0]),
                y = Math.round((Math.sin(angle) * (point[0] - pivot[0])) +
                    (Math.cos(angle) * (point[1] - pivot[1])) +
                    pivot[1]);
            return [x, y];
        }

        let tx = this.tx;
        let ty = this.ty;

        if (this.defend) {
            if (!this.defendPoly) {
                let poly = [];
                let angles = this.defendPolyAngles;
                let angleValue = 360/angles;
                let angleLoop = this.angle;
                let a;
                for(a=0;a<angles;a++){
                    poly.push(rotatePoint([this.tx,this.ty],[this.x,this.y],angleLoop));
                    angleLoop += angleValue;
                }
                this.defendPoly = poly;
                this.defendPolyNow = 0;
            }
            tx = this.defendPoly[this.defendPolyNow][0];
            ty = this.defendPoly[this.defendPolyNow][1];
            if (distance(tx,ty,this.x,this.y) < 10) {
                this.defendPolyNow++;
                if (this.defendPolyNow>this.defendPolyAngles-1) {
                    this.defendPolyNow = 0;
                }
            }
        }

        this.angle = Math.atan2(ty - this.y, tx - this.x) * 180 / Math.PI;

        this.vx = Math.cos(radians(this.angle))*this.speed;
        this.vy = Math.sin(radians(this.angle))*this.speed;

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        this.lookangle = Math.atan2(this.look[1] - this.y, this.look[0] - this.x) * 180 / Math.PI;

        function findNewPoint(x, y, angle, distance) {
            var result = {};
            result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
            result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
            return result;
        }

        var p_max = findNewPoint(this.look[0],this.look[1],this.lookangle-90,randomFloat(0,this.radius));
        var p_min = findNewPoint(this.look[0],this.look[1],this.lookangle+90,randomFloat(0,this.radius));
        var p = Math.random()>0.5?p_min:p_max;

        this.shoot_angle = Math.atan2(p.y - this.y, p.x - this.x) * 180 / Math.PI;

    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}


export default Drone;