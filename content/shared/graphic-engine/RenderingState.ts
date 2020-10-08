import { mat4 } from 'gl-matrix'

export class RenderingState {
    readonly gl: WebGLRenderingContext;
    projectionMatrix: mat4;
    viewMatrix: mat4;
    modelMatrix: mat4;

    constructor (gl: WebGLRenderingContext) {
      this.gl = gl
      this.gl.enable(this.gl.CULL_FACE)
      this.gl.cullFace(this.gl.BACK)
      this.projectionMatrix = mat4.identity(mat4.create())
      this.viewMatrix = mat4.identity(mat4.create())
      this.modelMatrix = mat4.identity(mat4.create())
    }
}
