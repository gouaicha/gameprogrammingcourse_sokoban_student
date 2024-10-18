import { defineComponent, Types } from '../bitecs.mjs'

export const Transform = defineComponent({
	scaleX: Types.f32,
	scaleY: Types.f32,
	rotation: Types.f32,
})

export default Transform