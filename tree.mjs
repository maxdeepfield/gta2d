import EventEmitter from 'events';

class Tree extends EventEmitter  {
    constructor(options) {
        super();
        this.type = 'bullet';
        this.hp = options.hp;
        this.id = options.id;
        this.x = options.x;
        this.y = options.y;
        this.scale = options.scale || 1;
        this.angle = options.angle || 0;
        this.start = new Date();
    }
    update() {

    }
    destroy(){
        this.emit('destroy', 'destroy');
    }
}

export default Tree;