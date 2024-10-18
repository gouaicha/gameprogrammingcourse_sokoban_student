import {
	addEntity,
	addComponent,
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import Bloc from '../components/Bloc.js'
import Sprite from '../components/Sprite.js'



export class BlocFactory {


    //
    constructor(world)
    {
        this.world = world;
    }

    create(x,y)
    {
        const eid = addEntity(this.world)
        addComponent(this.world, Position, eid)
        addComponent(this.world, Bloc, eid)
        addComponent(this.world, Sprite, eid)
        Position.x[eid] = x
        Position.y[eid] = y
        Sprite.texture[eid] = 2 
        return eid;
    }
}