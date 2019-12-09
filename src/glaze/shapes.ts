import { GlDrawMode } from './enums'

export interface Shape {
  vertex: number[],
  mode: number
}

export const Rectangle = {
  vertex: [
    -1, -1,
    -1, 1,
    1, -1,
    1, 1
  ],
  mode: GlDrawMode.TRIANGLE_STRIP
}
