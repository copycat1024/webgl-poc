export class GlDrawMode {
  static POINTS = WebGLRenderingContext.POINTS;
  static LINE_STRIP = WebGLRenderingContext.LINE_STRIP;
  static LINE_LOOP = WebGLRenderingContext.LINE_LOOP;
  static LINES = WebGLRenderingContext.LINES;
  static TRIANGLE_STRIP = WebGLRenderingContext.TRIANGLE_STRIP;
  static TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;
  static TRIANGLES = WebGLRenderingContext.TRIANGLES;
}

const FLOAT = 'f'
const INT = 'i'
const UNSIGNED_FLOAT = 'uf'
const UNSIGNED_INT = 'ui'

export type GlVariableType = typeof FLOAT | typeof INT | typeof UNSIGNED_FLOAT | typeof UNSIGNED_INT 