import Utils from './utils.mjs';
let distance =Utils.distance;
let radians =Utils.radians;

import EventEmitter from 'events';

class Fly extends EventEmitter  {
    constructor(options) {
        super();
        this.id = options.id;
        this.player_id = options.player_id;
        this.type = 'fly';
        this.hp = options.hp;
        this.x = options.x;
        this.y = options.y;
        this.tx = options.tx;
        this.ty = options.ty;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.angle = options.angle || 0;
        this.speed = options.speed || 3;
        this.start = new Date();

        this.defend = false;
        this.defendRadius = options.defendRadius || 100;
        this.defendPolyAngles = options.defendPolyAngles || 16;
        this.defendPoly = null;
        this.defendPolyNow = 0;
        //todo falloff
        //todo damage // here?
        //todo size/type big/explode/aoe(radius?dmg falloff?)
        //todo color/mode
        //todo hp:)
    }
    update() {
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
    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}


export default Fly;

