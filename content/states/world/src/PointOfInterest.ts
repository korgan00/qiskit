import { vec2, vec3, vec4, quat } from 'gl-matrix'
import { ShaderProgram } from '../../../shared/graphic-engine/ShaderProgram'
import { Texture } from '../../../shared/graphic-engine/Texture'
import { RenderingState } from '../../../shared/graphic-engine/RenderingState'
import { Entity } from '../../../shared/graphic-engine/Entity'
import { MeshRenderer } from '../../../shared/graphic-engine/MeshRenderer'
import { Transform } from '../../../shared/graphic-engine/Transform'
import { quad } from '../../../shared/graphic-engine/utils/quad'
import { Material } from '../../../shared/graphic-engine/Material'

export class PointOfInterest extends Entity {
    transform: Transform;
    private _polarCoords!: vec2;
    name = '';
    text = '';

    set polarCoords (c: vec2) {
      this._polarCoords = c
      this.updatePolarPosition()
    }

    get polarCoords (): vec2 {
      return this._polarCoords
    }

    constructor (sp: ShaderProgram, rs: RenderingState, parent: Transform) {
      super()
      const gl: WebGLRenderingContext = rs.gl

      // const point:Entity = new Entity();
      const material: Material = new Material(rs, sp)
      material.albedo = new Texture(gl, '/resources/states/textures/circle-64px.png')
      material.color = vec4.fromValues(1, 0, 0, 1)
      const meshRenderer: MeshRenderer = new MeshRenderer(rs, quad(), material)
      super.addComponent(meshRenderer)

      this.transform = new Transform()
      this.polarCoords = vec2.create()
      this.updatePolarPosition()

      this.transform.scale = vec3.fromValues(0.04, 0.04, 0.04)
      this.transform.parentTransform = parent
      this.transform.onUpdate = (_) => {
        this.transform.screenPosition(rs.projectionMatrix, rs.viewMatrix)
      }
      super.addComponent(this.transform)
    }

    private updatePolarPosition () {
      const coords:quat = quat.create()
      const latDeg = -this._polarCoords[0] + 90
      quat.rotateY(coords, coords, this._polarCoords[1] / 180 * Math.PI - Math.PI) // LONGITUDE
      quat.rotateZ(coords, coords, latDeg / 180 * Math.PI) // LATITUDE

      this.transform.position = vec3.fromValues(0.0, 1.005, 0.0)
      vec3.transformQuat(this.transform.position, this.transform.position, coords)

      // face rotation correction
      const rot: quat = quat.create()
      quat.rotateX(rot, rot, -Math.PI / 2)
      quat.multiply(rot, coords, rot)

      this.transform.rotation = rot
    }

    showLocationDataPanel () {
      const panel = document.querySelector('#LocationData')
      const title = document.querySelector('#LocationData span')
      const text = document.querySelector('#LocationData p')

      if (panel && title && text) {
        panel.classList.remove('hidden')
        title.textContent = this.name
        text.textContent = this.text
      }
    }

    hideLocationDataPanel () {
      const panel = document.querySelector('#LocationData')
      if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden')
      }
    }
}
