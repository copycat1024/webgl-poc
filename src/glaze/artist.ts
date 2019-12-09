import { Glaze } from '.'
import { GlVariableType } from './enums'

export interface AttributeConfig {
  type?: number,
  normalized?: boolean,
  stride?: number,
  offset?: number
}

export abstract class Artist {
  program: WebGLProgram
  ctx: WebGLRenderingContext
  attributes: { [id: string]: number } = {}
  uniforms: { [id: string]: WebGLUniformLocation } = {}
  buffers: { [id: string]: WebGLBuffer } = {}

  constructor(glz: Glaze) {
    const { ctx } = glz

    // create program
    const program = ctx.createProgram();
    if (!program) throw new Error('Cannot create new program');

    // set program and context
    this.program = program
    this.ctx = ctx
  }

  // helpers methods
  protected attachShader(source: string, type: number) {
    const { ctx, program } = this

    // create new shader instance
    const shader = ctx.createShader(type);
    if (!shader) throw new Error('Cannot create new shader')

    // compile shader source code
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);

    // check compilation status
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      const info_log = ctx.getShaderInfoLog(shader);
      ctx.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + info_log);
    }

    // attach shader
    ctx.attachShader(program, shader)
  }

  protected linkProgram() {
    const { ctx, program } = this

    // link the shaders to the program
    ctx.linkProgram(program);

    // check for error
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      const info_log = ctx.getProgramInfoLog(program)
      throw new Error('Unable to link shader program: ' + info_log);
    }

    // use the linked program
    ctx.useProgram(program)
  }

  protected createBuffer(name: string) {
    const { ctx } = this

    const buffer = ctx.createBuffer();
    if (!buffer) throw new Error('Cannot create new buffer');
    this.buffers[name] = buffer
  }

  protected setBuffer(name: string, array?: ArrayBufferView) {
    const { ctx, buffers } = this
    const buffer = buffers[name]

    // bind buffer
    if (ctx.getParameter(ctx.ARRAY_BUFFER_BINDING) !== buffer)
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);

    // set buffer value if given
    if (array)
      ctx.bufferData(ctx.ARRAY_BUFFER, array, ctx.STATIC_DRAW)
  }

  protected bindAttribute(attribute: string, buffer: string, size: number, config?: AttributeConfig) {
    const { ctx } = this
    const attr = this.getAttributeLocation(attribute)

    // get config
    config = config || {}
    const type = config.type || ctx.FLOAT
    const normalized = config.normalized || false
    const stride = config.stride || 0
    const offset = config.offset || 0

    // bind buffer to attribute
    ctx.enableVertexAttribArray(attr)
    this.setBuffer(buffer)
    ctx.vertexAttribPointer(attr, size, type, normalized, stride, offset)
  }

  protected setUniform(name: string, type: GlVariableType, data: number[]) {
    const ctx: any = this.ctx

    // get uniform location
    const uniform = this.getUniformLocation(name)

    // verify data length
    if (data.length > 4 || data.length < 1)
      throw new Error('Uniform size is between 1 and 4')

    // call uniform function
    const func_name = 'uniform' + data.length + type + 'v'
    const func = ctx[func_name]
    func.apply(ctx, [uniform, data])
  }

  protected setUniformMatrix(name: string, data: number[]) {
    const ctx: any = this.ctx

    // get uniform location
    const uniform = this.getUniformLocation(name)

    // verify data length
    let sz = 0
    switch (data.length) {
      case 4:
        sz = 2;
        break;
      case 9:
        sz = 3;
        break;
      case 16:
        sz = 4;
        break
      default:
        throw new Error('Uniform size is between 1 and 4')
    }

    // call uniform function
    const func_name = 'uniformMatrix' + sz + 'fv'
    const func = ctx[func_name]
    func.apply(ctx, [uniform, false, data])
  }

  private getAttributeLocation(name: string) {
    const { ctx, program, attributes } = this

    // load attribute location if not yet loaded
    attributes[name] = attributes[name] || ctx.getAttribLocation(program, name)

    // return attribute location
    return attributes[name]
  }

  private getUniformLocation(name: string) {
    const { ctx, program, uniforms } = this

    // load uniforms location if not yet loaded
    uniforms[name] = uniforms[name] || ctx.getUniformLocation(program, name)

    // return uniforms location
    return uniforms[name]
  }
}
