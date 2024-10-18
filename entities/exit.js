import {
	addEntity,
	addComponent,
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import Sprite from '../components/Sprite.js'



export class ExitFactory {


    //
    constructor(world)
    {
        this.world = world;
    }

    create(x,y)
    {
        const eid = addEntity(this.world)
        addComponent(this.world, Position, eid)
        addComponent(this.world, Sprite, eid)
        Position.x[eid] = x
        Position.y[eid] = y
        Sprite.texture[eid] = 1
        return eid;
    }
}