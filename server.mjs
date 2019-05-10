import Game from './game.mjs';
global.Game = Game;//todo is this even used?

let game = new Game({
    w: 10000,
    h: 10000
});

game.start();