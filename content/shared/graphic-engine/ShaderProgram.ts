import { Callback } from './Callback'
import { RenderingState } from './RenderingState'

interface ProgramAttributeLocations {
    vertexPosition: number,
    vertexUV: number,
}

interface ProgramUniformLocations {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation,
    albedo: WebGLUniformLocation,
    color: WebGLUniformLocation,
}

export class ShaderProgram {
    readonly program: WebGLProgram | null | undefined;
    readonly attribLocations: ProgramAttributeLocations;
    readonly uniformLocations: ProgramUniformLocations;
    private _state: RenderingState;

    constructor (state: RenderingState, vsSource: string, fsSource: string, onError: Callback<string> = s => console.error(s)) {
      const gl = state.gl
      this._state = state
      this.attribLocations = <ProgramAttributeLocations>{}
      this.uniformLocations = <ProgramUniformLocations>{}

      const vertexShader: any = this.loadShader(gl, gl.VERTEX_SHADER, vsSource, onError)
      if (vertexShader === undefined) { return }

      const fragmentShader: any = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource, onError)
      if (fragmentShader === undefined) {
        gl.deleteShader(vertexShader)
        return
      }

      // Create the shader program

      this.program = gl.createProgram()
      if (this.program === null) {
        return
      }
      gl.attachShader(this.program, vertexShader)
      gl.attachShader(this.program, fragmentShader)
      gl.linkProgram(this.program)

      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      // If creating the shader program failed, alert

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        const errMsg: string = 'Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.program)
        gl.deleteProgram(this.program)
        this.program = null
        onError(errMsg)
        return
      }

      this.attribLocations = {
        vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
        vertexUV: gl.getAttribLocation(this.program, 'aVertexUV')
      }
      this.uniformLocations = {
        projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix')!,
        modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix')!,
        albedo: gl.getUniformLocation(this.program, 'albedo')!,
        color: gl.getUniformLocation(this.program, 'color')!
      }
    }

    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    private loadShader (gl: WebGLRenderingContext, type: number, source: string, onError: Callback<string> = () => {}): WebGLShader | undefined {
      const shader: WebGLShader = gl.createShader(type)!

      // Send the source to the shader object
      gl.shaderSource(shader, source)

      // Compile the shader program
      gl.compileShader(shader)

      // See if it compiled successfully

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const errMsg: string = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        onError(errMsg)
        return undefined
      }

      return shader
    };

    setupVertexAttribs (): void {
      this._state.gl.vertexAttribPointer(
        this.attribLocations.vertexPosition,
        3,
        this._state.gl.FLOAT,
        false,
        0,
        0)
      this._state.gl.enableVertexAttribArray(this.attribLocations.vertexPosition)
    }

    setupUVsAttribs (): void {
      this._state.gl.vertexAttribPointer(
        this.attribLocations.vertexUV,
        2,
        this._state.gl.FLOAT,
        false,
        0,
        0)
      this._state.gl.enableVertexAttribArray(this.attribLocations.vertexUV)
    }
}
