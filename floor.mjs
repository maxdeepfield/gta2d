import EventEmitter from 'events';

class Floor extends EventEmitter  {
    constructor(options) {
        super();
        this.type = 'bullet';
        this.hp = options.hp;
        this.id = options.id;
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
        this.type = options.type;
        this.start = new Date();
    }
    update() {

    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}

export default Floor;