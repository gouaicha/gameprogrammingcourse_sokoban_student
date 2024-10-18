import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import {Direction, Movement} from '../components/Movement.js'


export default function createInputSystem(scene) 
    {
	const spriteQuery = defineQuery([Position, Movement]);

    function handleEntity(eid,word)
    {
        if(!Movement.dirty[eid]) return;

        if ( Movement.direction[eid] == Direction.right ) 
            {
                let i = Position.x[eid]
                if(i < scene.levelData.stage.grid.width)
                {
                    Position.x[eid] = i+1
                    scene.updateMoves()
                }           
            }
        else if( Movement.direction[eid] == Direction.left ) 
            {
                let i = Position.x[eid]
                if(i > 0)
                {
                Position.x[eid] = i-1
                scene.updateMoves()
                }       
            }
            else if( Movement.direction[eid] == Direction.up ) 
                {
                    let i = Position.y[eid]
                    if(i > 0)
                    {
                            Position.y[eid] = i-1
                            scene.updateMoves()
                    }       
                }
                else if( Movement.direction[eid] == Direction.down ) 
                    {
                        let i = Position.y[eid]
                        
                        if(i < scene.levelData.stage.grid.height )
                            {
                                Position.y[eid] = i+1
                                scene.updateMoves()
                            }    
                    }

        Movement.dirty[eid] = 0
        
    }

    



	return defineSystem((world) => 
        {
        const entities = spriteQuery(world)	
        entities.forEach( 
            (eid) => {
                handleEntity(eid,world);
            }
        );
        return world;
	    }
    )
}