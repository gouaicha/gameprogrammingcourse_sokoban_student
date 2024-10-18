import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from '../bitecs.mjs'

import Player from '../components/Player.js'
import Position from '../components/Position.js'

export default function createGameOverSystem(scene) 
    {
	const spriteQuery = defineQuery([Player ,Position]);
	//TODO
    return defineSystem((world) => 
        {
        //TODO : add your code here
        
        return world
	    }
    
    
    )
}