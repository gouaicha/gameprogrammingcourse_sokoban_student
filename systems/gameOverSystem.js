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
	return defineSystem((world) => 
        {
        const entities = spriteQuery(world)
        if(entities[0]){
        let playerX = Position.x[entities[0]];
        let playerY = Position.y[entities[0]];
        if( playerX == scene.levelData.stage.exit.x 
            && playerY == scene.levelData.stage.exit.y)
            {
                scene.gameOver = true;
            }    
        }
        return world
	    }
    
    
    )
}