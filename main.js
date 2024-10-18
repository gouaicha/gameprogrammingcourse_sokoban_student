import {
	createWorld,
	addEntity,
	addComponent,
} from './bitecs.mjs'

import { Bootloader } from './scenes/bootloader.js';
import { Splash } from './scenes/splash.js';
import { Transition } from './scenes/transition.js';
import { Game } from './scenes/game.js';
import { Credit } from './scenes/credit.js';


import Position from './components/Position.js'

const config = {
    title: 'Blocs',
    type: Phaser.AUTO,
    backgroundColor: "#192a56",
    width: 600,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        autoRound: false,
        physics: {
        default: "arcade",
        arcade: {
        gravity: { y: 0 },
        debug: false,
        },
        },
    plugins: {},
    scene: [Bootloader, Splash, Transition, Game, Credit]
};

new Phaser.Game(config);
 