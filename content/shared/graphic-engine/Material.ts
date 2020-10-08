import { vec4, mat4 } from 'gl-matrix'
import { ShaderProgram } from './ShaderProgram'
import { Texture } from './Texture'
import { RenderingState } from './RenderingState'

export enum BlendMode {
    ALPHA,
    ADD,
    MUL
};

export class Material {
    shader: ShaderProgram;
    private _state: RenderingState;

    albedo: Texture | undefined;
    color: vec4 = vec4.fromValues(1.0, 1.0, 1.0, 1.0);

    private _blendSFactor!: number;
    private _blendDFactor!: number;
    private _blendMode: BlendMode = 0;

    get blendMode (): BlendMode { return this._blendMode }
    set blendMode (mode: BlendMode) {
      this._blendMode = mode
      if (this._blendMode === BlendMode.ALPHA) {
        this._blendSFactor = this._state.gl.SRC_ALPHA
        this._blendDFactor = this._state.gl.ONE_MINUS_SRC_ALPHA
      } else if (this._blendMode === BlendMode.ADD) {
        this._blendSFactor = this._state.gl.SRC_ALPHA
        this._blendDFactor = this._state.gl.ONE
      } else if (this._blendMode === BlendMode.MUL) {
        this._blendSFactor = this._state.gl.ZERO
        this._blendDFactor = this._state.gl.ONE_MINUS_SRC_COLOR
      }
    }

    constructor (state: RenderingState, shader: ShaderProgram) {
      this.shader = shader
      this._state = state
      this.blendMode = BlendMode.ALPHA
    }

    activate (): void {
      const gl: WebGLRenderingContext = this._state.gl
      const unifLoc = this.shader.uniformLocations
      gl.blendFunc(this._blendSFactor, this._blendDFactor)
      gl.useProgram(this.shader.program!)

      // Set the shader uniforms
      gl.uniformMatrix4fv(unifLoc.projectionMatrix, false, this._state.projectionMatrix)
      gl.uniformMatrix4fv(unifLoc.modelViewMatrix, false, this.mvMatrix())

      gl.uniform4fv(unifLoc.color, this.color)

      if (this.albedo) {
        gl.uniform1i(unifLoc.albedo, 0)
        this.albedo.bindTexture()
      }
    }

    private mvMatrix (): mat4 {
      return mat4.mul(mat4.create(), this._state.viewMatrix, this._state.modelMatrix)
    }
}
