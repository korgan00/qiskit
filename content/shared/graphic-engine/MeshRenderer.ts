import { MeshBuffers } from './MeshBuffers'
import { RenderingState } from './RenderingState'
import { Drawable } from './Drawable'
import { Entity } from './Entity'
import { Transform } from './Transform'
import { Material } from './Material'

export class MeshRenderer implements Drawable {
    // private _shaderProgram: ShaderProgram;
    private _meshBuffers: MeshBuffers;
    // private _texture: Texture;
    private _state: RenderingState;
    material: Material;

    constructor (state: RenderingState, mesh: MeshBuffers | Mesh, material: Material) {
      this.material = material

      if (mesh instanceof MeshBuffers) {
        this._meshBuffers = mesh
      } else {
        this._meshBuffers = new MeshBuffers(state, mesh)
      }

      // this._texture = texture;
      this._state = state
    }

    draw (entity: Entity): void {
      const transf: Transform | undefined = entity.getComponent<Transform>()
      if (!transf) {
        return
      }
      this._state.modelMatrix = transf.matrix

      this.material.activate()

      this._meshBuffers.bindVertexBuffer()
      this.material.shader.setupVertexAttribs()
      this._meshBuffers.bindUVsBuffer()
      this.material.shader.setupUVsAttribs()

      this._meshBuffers.draw()
    }
}
