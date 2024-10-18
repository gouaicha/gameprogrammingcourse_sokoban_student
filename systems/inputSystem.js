import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from '../bitecs.mjs'

import Input from '../components/Input.js'
import {Direction, Movement} from '../components/Movement.js'

export default function createInputSystem(scene) 
    {
	const spriteQuery = defineQuery([Movement ,Input]);
    let isOnCooldown = false;
	return defineSystem((world) => 
        {
        if(isOnCooldown) return world;

        let actionTaken = false
        const entities = spriteQuery(world)
        if (scene.cursors.left.isDown) {
            for (let i = 0; i < entities.length; ++i)
                {
                    const id = entities[i]
                    Movement.direction[id] = Direction.left
                    Movement.dirty[id] = 1
                }
            actionTaken = true

        } else if(scene.cursors.right.isDown){
            for (let i = 0; i < entities.length; ++i)
                {
                    const id = entities[i]
                    Movement.direction[id] = Direction.right
                    Movement.dirty[id] = 1
                }
            actionTaken = true
        } else if(scene.cursors.up.isDown){
            for (let i = 0; i < entities.length; ++i)
                {
                    const id = entities[i]
                    Movement.direction[id] = Direction.up
                    Movement.dirty[id] = 1
                }
            actionTaken = true
        }else if(scene.cursors.down.isDown){
            for (let i = 0; i < entities.length; ++i)
                {
                    const id = entities[i]
                    Movement.direction[id] = Direction.down
                    Movement.dirty[id] = 1
                }
            actionTaken = true
        }
        if(actionTaken)
            {
            isOnCooldown = true;
            scene.time.delayedCall(200, () => {
            isOnCooldown = false;  
            });
        }
		return world
	    }    
    )
}