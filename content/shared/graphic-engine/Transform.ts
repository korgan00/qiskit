import { vec2, mat4, vec3, quat } from 'gl-matrix'
import { Component } from './Component'
import { Entity } from './Entity'
import { Callback } from './Callback'

export class Transform implements Component {
    position: vec3;
    rotation: quat;
    scale: vec3;

    parentTransform?: Transform;
    onUpdate?: Callback<{ deltaTime: number, entity: Entity }>;

    // TODO think about cache this matrix.
    get matrix (): mat4 {
      const transform: mat4 = mat4.create()
      mat4.fromRotationTranslationScale(transform, this.rotation, this.position, this.scale)

      if (this.parentTransform !== undefined) {
        mat4.mul(transform, this.parentTransform.matrix, transform)
      }

      return transform
    }

    get worldPosition () : vec3 {
      if (this.parentTransform) {
        return vec3.transformMat4(vec3.create(), this.position, this.parentTransform.matrix)
      }
      return this.position
    }

    constructor (position: vec3 = vec3.create(), rotation: quat = quat.create(), scale: vec3 = vec3.fromValues(1, 1, 1), onUpdate?: Callback<{ deltaTime: number, entity: Entity }>) {
      this.position = position
      this.rotation = rotation
      this.scale = scale
      this.onUpdate = onUpdate
    }

    update (deltaTime: number, entity: Entity): void {
      if (this.onUpdate !== undefined) { this.onUpdate({ deltaTime, entity }) }
    }

    screenPosition (projectionMatrix: mat4, viewMatrix: mat4): vec2 {
      const worldToScreenMat4: mat4 = this.matrix
      mat4.mul(worldToScreenMat4, viewMatrix, worldToScreenMat4)
      mat4.mul(worldToScreenMat4, projectionMatrix, worldToScreenMat4)

      const projectionSpacePos: vec3 = vec3.create()
      vec3.transformMat4(projectionSpacePos, projectionSpacePos, worldToScreenMat4)

      const screenPos: vec2 = vec2.fromValues(projectionSpacePos[0], projectionSpacePos[1])
      vec2.add(screenPos, screenPos, [1, 1])
      vec2.mul(screenPos, screenPos, [0.5, 0.5])
      return screenPos
    }
}
