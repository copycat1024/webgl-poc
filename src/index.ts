import { Glaze, Basic2D, Rectangle } from './glaze'

function main() {
  const canvas = document.getElementById('canvas');

  // check if the element is a canvas
  if (canvas instanceof HTMLCanvasElement) {
    const glz = new Glaze(canvas)
    canvas.onmouseover = () => console.log('Mouse over')
    canvas.onmouseout = () => console.log('Mouse out')
    canvas.onmousemove = () => console.log('Mouse move')

    const artist = new Basic2D(glz)
    const { random } = Math

    glz.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    glz.ctx.clear(glz.ctx.COLOR_BUFFER_BIT)

    const row_num = 4
    const col_num = 4

    for (let i = 0; i < row_num; i++) {
      for (let j = 0; j < col_num; j++) {
        const { width, height } = glz.resolution
        const x = width * (j + 0.5) / col_num
        const y = height * (i + 0.5) / row_num

        artist.setColor(1, 1, 1)
        artist.draw(Rectangle, {
          size: 100,
          position: { x, y }
        })
      }
    }
  } else {
    // throw if the element is not a canvas
    throw new Error(`Cannot get canvas element`)
  }

}

window.onload = main;
