export { Artist } from './artist'
export { Basic2D } from './basic2d'
export * from './shapes'
export * from './enums'

export interface Size {
  height: number,
  width: number
}

export interface Position {
  x: number,
  y: number
}

export class Glaze {
  ctx: WebGLRenderingContext
  resolution: Size

  constructor(canvas: HTMLCanvasElement, config?: WebGLRenderingContext) {
    // initialize gl context
    const ctx = <WebGLRenderingContext>canvas.getContext('webgl', config);
    if (!ctx) throw new Error('Cannot initialize webgl context');

    // assign the gl context
    this.ctx = ctx
    this.resolution = {
      height: ctx.drawingBufferHeight,
      width: ctx.drawingBufferWidth
    }
  }
}
