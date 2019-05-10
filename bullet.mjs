import Utils from './utils.mjs';
let radians =Utils.radians;

import EventEmitter from 'events';

class Bullet extends EventEmitter  {
    constructor(options) {
        super();
        this.type = 'bullet';
        this.hp = options.hp;
        this.damage = options.damage;
        this.id = options.id;
        this.player_id = options.player_id;
        this.parent_id = options.parent_id;
        this.x = options.x;
        this.y = options.y;
        this.tx = options.tx;
        this.ty = options.ty;
        this.vx = options.vx;
        this.vy = options.vy;
        this.angle = options.angle || Math.atan2(this.ty - this.y, this.tx - this.x) * 180 / Math.PI;
        this.speed = options.speed || 3;
        this.start = new Date();
        //todo falloff
        //todo damage // here?
        //todo size/type big/explode/aoe(radius?dmg falloff?)
        //todo color/mode
        //todo hp:)
    }
    update() {
        this.vx = Math.cos(radians(this.angle))*this.speed;
        this.vy = Math.sin(radians(this.angle))*this.speed;

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        if (new Date() - this.start > 5000) {
            this.destroy();
        }
    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}


export default Bullet;