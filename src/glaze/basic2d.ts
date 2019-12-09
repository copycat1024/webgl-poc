import { Glaze, Artist, Shape, Size, Position } from '.'
import { unit, translation, scaling, rotation, mul3 } from './linear'

import vert from '../shaders/xy.vert'
import frag from '../shaders/plain.frag'

const LEFT = 'left'
const RIGHT = 'right'
const TOP = 'top'
const BOTTOM = 'bottom'
const CENTER = 'center'

interface DrawConfig {
  horizontal_align?: typeof LEFT | typeof RIGHT | typeof CENTER
  vertical_align?: typeof TOP | typeof BOTTOM | typeof CENTER
  size?: number | Size
  position?: Position
  angle?: number
}

export class Basic2D extends Artist {
  matrix: number[]
  resolution: Size

  constructor(glz: Glaze) {
    const { ctx } = glz

    // call parent constructor
    super(glz)

    // load program
    this.attachShader(vert, WebGLRenderingContext.VERTEX_SHADER);
    this.attachShader(frag, WebGLRenderingContext.FRAGMENT_SHADER);
    this.linkProgram();

    // init buffer
    this.createBuffer('vertex')

    // set attributes
    this.matrix = unit()
    this.resolution = glz.resolution

    // set uniforms
    this.setColor(0, 0, 0)
  }

  setColor(r: number, g: number, b: number) {
    this.setUniform('u_color', 'f', [r, g, b])
  }

  draw(shape: Shape, config?: DrawConfig) {
    const { ctx, resolution } = this
    const { vertex, mode } = shape
    const {
      horizontal_align, vertical_align,
      position = {
        x: this.resolution.width / 2,
        y: this.resolution.height / 2
      },
      angle = 0,
    } = config || {}

    let { size } = config || {}
    if (typeof size === 'number') {
      size = { width: size, height: size }
    } else if (!size) {
      size = resolution
    }

    let horizontal_translate = 0
    if (horizontal_align === LEFT) {
      horizontal_translate = 1
    } else if (horizontal_align === RIGHT) {
      horizontal_translate = -1
    }

    let vertical_translate = 0
    if (vertical_align === BOTTOM) {
      vertical_translate = 1
    } else if (vertical_align === TOP) {
      vertical_translate = -1
    }

    // build matrix
    this.combineMatrix([
      // alignment translating
      translation(
        horizontal_translate,
        vertical_translate
      ),
      // rotate
      rotation(angle * 2 * Math.PI),
      // scale
      scaling(
        size.width / resolution.width,
        size.height / resolution.height
      ),
      // move O to top left
      translation(-1, 1),
      // move to xy
      translation(
        position.x / resolution.width * 2,
        -position.y / resolution.height * 2
      ),

    ])

    // load matrix
    this.setUniformMatrix('u_matrix', this.matrix)

    // load points into vertex buffer
    this.bindAttribute('a_position', 'vertex', 2)
    this.setBuffer('vertex', new Float32Array(vertex))

    // draw
    ctx.drawArrays(mode, 0, vertex.length / 2)
  }

  combineMatrix(matrix_list: number[][]) {
    this.matrix = unit()
    for (let m of matrix_list.reverse()) {
      this.matrix = mul3(this.matrix, m)
    }
  }
}
