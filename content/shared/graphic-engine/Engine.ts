import { mat4 } from 'gl-matrix'
import { Callback } from './Callback'
import { RenderingState } from './RenderingState'
import { Scene } from './Scene'

export class Engine {
    private _renderingState: RenderingState | undefined;
    get renderingState (): RenderingState | undefined { return this._renderingState };

    private _scene?: Scene;
    get scene (): Scene | undefined { return this._scene };
    set scene (s:Scene | undefined) { this._scene = s };

    private _time: number;
    get time (): number { return this._time };

    private _deltaTime: number;
    get deltaTime (): number { return this._deltaTime };

    constructor (canvas: HTMLCanvasElement, onError: Callback<string> = s => console.error(s)) {
      const gl = canvas.getContext('webgl')
      this._time = 0
      this._deltaTime = 0

      if (!gl) {
        onError('Unable to initialize WebGL. Your browser or machine may not support it.')
        return
      }
      this._renderingState = new RenderingState(gl)
      this.setupDefaultCamera()
    }

    Run (): void {
      if (!this._renderingState) {
        return
      }
      const gl = this._renderingState.gl
      gl.enable(gl.CULL_FACE)
      gl.cullFace(gl.BACK)

      requestAnimationFrame((t) => {
        this._time = t
        this.renderLoop(t)
      })
    }

    private renderLoop (now: number): void {
      now *= 0.001 // convert to seconds
      this._deltaTime = now - this._time
      this._time = now

      this.drawScene()

      requestAnimationFrame(t => this.renderLoop(t))
    }

    //
    // Draw the scene.
    //
    private drawScene (): void {
      if (!this._renderingState) {
        return
      }
      const gl: WebGLRenderingContext = this._renderingState.gl
      gl.clearColor(0.0, 0.0, 0.0, 0.0) // Clear to black, fully opaque
      gl.clearDepth(1.0) // Clear everything
      gl.enable(gl.DEPTH_TEST) // Enable depth testing
      gl.depthFunc(gl.LESS) // Near things obscure far things
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      // Clear the canvas before we start drawing on it.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      if (!this._scene) {
        return
      }
      this._scene.update(this._deltaTime)
      this._scene.draw()
    }

    private setupDefaultCamera (): void {
      if (!this._renderingState) {
        return
      }
      const gl: WebGLRenderingContext = this._renderingState.gl
      const fieldOfView = 45 * Math.PI / 180 // in radians
      const aspect = gl.canvas.width / gl.canvas.height
      const zNear = 0.1
      const zFar = 100.0
      const projectionMatrix = mat4.create()

      // note: glmatrix.js always has the first argument
      // as the destination to receive the result.
      mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar)

      this._renderingState.projectionMatrix = projectionMatrix
      this._renderingState.viewMatrix = mat4.create()
    }
}
