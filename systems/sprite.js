import {
	defineSystem,
	defineQuery,
	enterQuery,
	exitQuery
} from '../bitecs.mjs'

import Position from '../components/Position.js'
import Sprite from '../components/Sprite.js'
import Transform from '../components/Transform.js'

export default function createSpriteSystem(scene, textures) {
	const spritesById = new Map()

	const spriteQuery = defineQuery([Position, Sprite])
	
	const spriteQueryEnter = enterQuery(spriteQuery)
	const spriteQueryExit = exitQuery(spriteQuery)

	return defineSystem((world) => {
		const entitiesEntered = spriteQueryEnter(world)
		for (let i = 0; i < entitiesEntered.length; ++i)
		{
			const id = entitiesEntered[i]
			const texId = Sprite.texture[id]
			const texture = textures[texId]
			
			spritesById.set(id, scene.add.sprite(0, 0, texture))
		}

		const entities = spriteQuery(world)
		for (let i = 0; i < entities.length; ++i)
		{
			const id = entities[i]

			const sprite = spritesById.get(id)
			if (!sprite)
			{
				// log an error
				continue
			}
			sprite.x = Position.x[id]
			sprite.y = Position.y[id]
			sprite.setScale(Transform.scaleX[id],Transform.scaleY[id]) 
		}

		const entitiesExited = spriteQueryExit(world)
		for (let i = 0; i < entitiesExited.length; ++i)
		{
			const id = entitiesExited[i]
			spritesById.delete(id)
		}
		return world
	})
}