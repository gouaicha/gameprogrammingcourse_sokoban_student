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
        console.log(scene.gameState.grid)
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
                
            }
        else if( direction == Direction.left ) 
            {

                if(!scene.gameState.grid[fromX-1][fromY])
                    {
                        Position.x[eid] = fromX-1
                        return true;
                    }
                else if(
                        scene.gameState.grid[fromX-2]
                        &&
                        !scene.gameState.grid[fromX-2][fromY]
                    )
                    {

                        let neigheid = scene.gameState.grid[fromX-1][fromY]
                        scene.gameState.grid[fromX-2][fromY] = neigheid
                        scene.gameState.grid[fromX-1][fromY] = null 
                        Position.x[eid] = fromX-1;
                        Position.x[neigheid] = fromX-2;
                        return true;
                    }    
                
            }
            else if( direction == Direction.down ) 
                {
                    if(!scene.gameState.grid[fromX][fromY+1])
                        {
                            //scene.gameState.grid[fromX][fromY] = null
                            Position.y[eid] = fromY+1
                            return true;
                        }
                        else if(
                            fromY+2 < scene.levelData.stage.grid.height
                            &&
                            scene.gameState.grid[fromX]
                            &&
                            !scene.gameState.grid[fromX][fromY+2]
                        )
                        {
    
                            let neigheid = scene.gameState.grid[fromX][fromY+1]
                            scene.gameState.grid[fromX][fromY+2] = neigheid
                            scene.gameState.grid[fromX][fromY+1] = null 
                            Position.y[eid] = fromY+1;
                            Position.y[neigheid] = fromY+2;
                            return true;
                        }
                
                }
                else if( direction == Direction.up ) 
                    {

                        if(!scene.gameState.grid[fromX][fromY-1])
                            {
                                Position.y[eid] = fromY-1
                                return true;
                            }
                        else if(
                            fromY-2 >= 0
                            &&
                            scene.gameState.grid[fromX]
                            &&
                            !scene.gameState.grid[fromX][fromY-2]
                        )
                        {
    
                            let neigheid = scene.gameState.grid[fromX][fromY-1]
                            scene.gameState.grid[fromX][fromY-2] = neigheid
                            scene.gameState.grid[fromX][fromY-1] = null 
                            Position.y[eid] = fromY-1;
                            Position.y[neigheid] = fromY-2;
                            return true;
                        }  
                
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