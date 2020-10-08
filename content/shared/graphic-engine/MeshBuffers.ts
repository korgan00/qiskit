// import { RenderingState } from "./RenderingState";

import { RenderingState } from './RenderingState'

export class MeshBuffers {
    verticesBuffer: WebGLBuffer | null;
    verticesLenght: number;
    facesBuffer: WebGLBuffer | null;
    facesLenght: number;
    uvBuffer?: WebGLBuffer | null;
    uvLenght: number;
    private _state: RenderingState;

    constructor (state: RenderingState, mesh: Mesh) {
      const gl = state.gl
      this._state = state

      this.verticesBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
      this.verticesLenght = mesh.vertices.length

      this.facesBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, gl.STATIC_DRAW)
      this.facesLenght = mesh.triangles.length

      this.uvLenght = 0
      if (mesh.uv) {
        this.uvBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, mesh.uv, gl.STATIC_DRAW)
        this.uvLenght = mesh.uv.length
      }
    }

    bindVertexBuffer (): void {
      this._state.gl.bindBuffer(this._state.gl.ARRAY_BUFFER, this.verticesBuffer)
    }

    bindUVsBuffer (): void {
      if (this.uvBuffer) {
        this._state.gl.bindBuffer(this._state.gl.ARRAY_BUFFER, this.uvBuffer)
      }
    }

    draw (): void {
      this._state.gl.bindBuffer(this._state.gl.ELEMENT_ARRAY_BUFFER, this.facesBuffer)
      this._state.gl.drawElements(this._state.gl.TRIANGLES, this.facesLenght, this._state.gl.UNSIGNED_SHORT, 0)
    }
}
