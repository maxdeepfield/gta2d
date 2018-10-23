import EventEmitter from 'events';

class Zavod extends EventEmitter  {
    constructor(options) {
        super();
        this.type = 'zavod';
        this.hp = options.hp;
        this.id = options.id;
        this.x = options.x;
        this.y = options.y;
        this.w = options.w || 200;
        this.h = options.h || 200;
        this.start = new Date();
        this.emit('create', 'create');
    }
    update() {

    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}

export default Zavod;