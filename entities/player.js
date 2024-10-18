import {
	addEntity,
	addComponent,
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import Bloc from '../components/Bloc.js'
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
        const eid = addEntity(this.world)
        addComponent(this.world, Input, eid)
        addComponent(this.world, Position, eid)
        addComponent(this.world, Bloc, eid)
        addComponent(this.world, Player, eid)
        addComponent(this.world, Sprite, eid)
        addComponent(this.world, Movement, eid)
        Position.x[eid] = x
        Position.y[eid] = y
        Sprite.texture[eid] = 0
        return eid;
    }
}