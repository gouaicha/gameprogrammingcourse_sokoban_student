import {
	addEntity,
	addComponent,
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import Player from '../components/Player.js'
import Sprite from '../components/Sprite.js'
import Input from '../components/Input.js'
import Movement from '../components/Movement.js'



export class PlayerFactory {


    //
    constructor(world)
    {
        this.world = world;
    }

    create(x,y)
    {        
    return undefined; //TODO: add your code
    }
}