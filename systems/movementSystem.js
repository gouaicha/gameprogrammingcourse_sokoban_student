import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import {Direction, Movement} from '../components/Movement.js'


export default function createMovementSystem(scene) 
    {
	const spriteQuery = defineQuery([Position, Movement]);
    function tryMove(eid,direction)
    {
        let fromX = Position.x[eid]
        let fromY = Position.y[eid]
        if ( direction == Direction.right ) 
            {
                    if(!scene.gameState.grid[fromX+1][fromY])
                    {
                        //
                        //scene.gameState.grid[fromX][fromY] = null
                        Position.x[eid] = fromX+1
                        return true;
                    }
                    else if(
                        scene.gameState.grid[fromX+2]
                        &&
                        !scene.gameState.grid[fromX+2][fromY]
                    )
                    {

                        let neigheid = scene.gameState.grid[fromX+1][fromY]
                        scene.gameState.grid[fromX+2][fromY] = neigheid
                        scene.gameState.grid[fromX+1][fromY] = null 
                        Position.x[eid] = fromX+1;
                        Position.x[neigheid] = fromX+2;
                        return true;
                    }
                    return false;
            }
        else 
        {
        
            //TODO: handle all other directions

        }   
                   

    }

    function handleEntity(eid,word)
    {
        if(!Movement.dirty[eid]) return;

        if ( Movement.direction[eid] == Direction.right ) 
            {
                let i = Position.x[eid]
                if(i+1 < scene.levelData.stage.grid.width)
                {
                    if(tryMove(eid,Direction.right))
                    {
                    scene.updateMoves()
                    }
                }           
            }
        else if( Movement.direction[eid] == Direction.left ) 
            {
                let i = Position.x[eid]
                if(i > 0)
                {
                    if(tryMove(eid,Direction.left))
                        {
                        scene.updateMoves()
                        }
                }       
            }
            else if( Movement.direction[eid] == Direction.up ) 
                {
                    let i = Position.y[eid]
                    if(i > 0)
                    {
                        if(tryMove(eid,Direction.up))
                            {
                                scene.updateMoves()
                            }                        
                    }       
                }
                else if( Movement.direction[eid] == Direction.down ) 
                    {
                        let i = Position.y[eid]
                        
                        if(i+1 < scene.levelData.stage.grid.height )
                            {
                                if(tryMove(eid,Direction.down))
                                    {
                                        scene.updateMoves()
                                    }                       
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