import { defineComponent, Types } from '../bitecs.mjs'

export const Movement = defineComponent({
	direction: Types.i8,
	dirty: Types.i8
});

export const Direction = {
	nop: 0,
	left: 1,
	right:2,
	up:3,
	down:4
}

export default Movement