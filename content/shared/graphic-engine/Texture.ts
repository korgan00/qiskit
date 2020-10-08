
export class Texture {
    readonly texture: WebGLTexture;
    private _gl: WebGLRenderingContext;

    constructor (gl: WebGLRenderingContext, url: string) {
      this._gl = gl
      this.texture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, this.texture)

      const level = 0
      const internalFormat = gl.RGBA
      const width = 1
      const height = 1
      const border = 0
      const srcFormat = gl.RGBA
      const srcType = gl.UNSIGNED_BYTE
      const pixel = new Uint8Array([0, 0, 1, 1])

      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel)

      const image = new Image()
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
          srcFormat, srcType, image)

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (this._isPowerOf2(image.width) && this._isPowerOf2(image.height)) {
          // Yes, it's a power of 2. Generate mips.
          gl.generateMipmap(gl.TEXTURE_2D)
        } else {
          // No, it's not a power of 2. Turn off mips and set
          // wrapping to clamp to edge
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        }
      }
      image.src = url
    }

    bindTexture () {
      // Tell WebGL we want to affect texture unit 0
      this._gl.activeTexture(this._gl.TEXTURE0)

      // Bind the texture to texture unit 0
      this._gl.bindTexture(this._gl.TEXTURE_2D, this.texture)
    }

    private _isPowerOf2 (value: number): boolean { return (value & (value - 1)) === 0 }
}
