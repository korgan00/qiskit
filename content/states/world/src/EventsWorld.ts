import { glMatrix, vec2, vec3, vec4, quat } from 'gl-matrix'
import { icomesh } from '../../../shared/graphic-engine/utils/icomesh'
import { ShaderProgram } from '../../../shared/graphic-engine/ShaderProgram'
import { Texture } from '../../../shared/graphic-engine/Texture'
import { Callback } from '../../../shared/graphic-engine/Callback'
import { RenderingState } from '../../../shared/graphic-engine/RenderingState'
import { Scene } from '../../../shared/graphic-engine/Scene'
import { Entity } from '../../../shared/graphic-engine/Entity'
import { MeshRenderer } from '../../../shared/graphic-engine/MeshRenderer'
import { Transform } from '../../../shared/graphic-engine/Transform'
import { Engine } from '../../../shared/graphic-engine/Engine'
import { Material } from '../../../shared/graphic-engine/Material'
import { PointOfInterest } from './PointOfInterest'

export class EventsWorldRenderer {
    private _scene: Scene;
    private _engine: Engine;
    private _canvas: HTMLCanvasElement;
    private _dragging: boolean;
    private _timeout: number;
    private _targetWorldCoords: vec2;
    private _worldEntity!: Entity;
    private _activePoint?: PointOfInterest;
    private _pointOfInterestList: PointOfInterest[];

    // VERTEX SHADER
    private readonly _vsSource: string = `
    attribute vec4 aVertexPosition;
    attribute vec2 aVertexUV;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = vec2(1.0-aVertexUV.x, 1.0-aVertexUV.y);
    }
  `;

    // FRAGMENT SHADER
    private readonly _fsSource: string = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D albedo;
    uniform lowp vec4 color;

    void main(void) {
        lowp vec4 sample = texture2D(albedo, vTextureCoord);
        if (sample.a < 0.1) {
            discard;
        }
        gl_FragColor = sample * color;
    }
  `;

    constructor (canvas: HTMLCanvasElement, onError: Callback<string> = s => console.error(s)) {
      this._engine = new Engine(canvas, onError)
      this._canvas = canvas
      this._scene = new Scene()
      this._engine.scene = this._scene
      this._targetWorldCoords = vec2.create()
      this._pointOfInterestList = []
      this._dragging = false
      this._timeout = -1
      this.populateScene()
    }

    Run (): void {
      this._engine.Run()
      this.SetupBehaviour()
      this.recenter()
    }

    private SetupBehaviour () {
      this._canvas.addEventListener('mousedown', this.onDragStart.bind(this))
      document.addEventListener('mousemove', this.onDrag.bind(this))
      this._canvas.addEventListener('mouseup', this.onDragEnd.bind(this))
    }

    private onDragStart (_ev: MouseEvent) {
      window.clearTimeout(this._timeout)
      this._dragging = true
    }

    private onDrag (ev: MouseEvent) {
      if (!this._dragging) {
        return
      }
      if (ev.buttons === 0) {
        this.onDragEnd(ev)
        return
      }
      const movement: vec2 = vec2.fromValues(ev.movementY, ev.movementX)
      vec2.scaleAndAdd(this._targetWorldCoords, this._targetWorldCoords, movement, 0.003) // wr + (movement * 0.001)
      this._targetWorldCoords[0] = Math.max(Math.min(this._targetWorldCoords[0], Math.PI / 4), -Math.PI / 4)
    }

    private onDragEnd (_ev: MouseEvent) {
      if (!this._dragging) {
        return
      }
      this._dragging = false
      this._timeout = window.setTimeout(this.recenter.bind(this), 3000)
    }

    private findMostCenteredPoint (maxDist = -1): PointOfInterest | undefined {
      let selectedPoint: PointOfInterest = this._pointOfInterestList[0]
      const frontPoint: vec3 = vec3.fromValues(0, 0, 1.005)
      let worldPosition: vec3 = vec3.create()
      if (this._worldEntity !== null) {
        const transform: any = this._worldEntity.getComponent<Transform>()
        if (transform !== undefined) {
          worldPosition = transform.position
        }
      }
      vec3.add(frontPoint, frontPoint, worldPosition)

      let minDist: number = vec3.sqrDist(selectedPoint.transform.worldPosition, frontPoint)
      this._pointOfInterestList.forEach((element) => {
        const dist = vec3.sqrDist(element.transform.worldPosition, frontPoint)
        if (dist < minDist) {
          minDist = dist
          selectedPoint = element
        }
      })

      return maxDist < 0 || minDist <= (maxDist * maxDist) ? selectedPoint : undefined
    }

    selectPoint(idx: number) : boolean {
      if (idx >= this._pointOfInterestList.length || idx < 0) { 
        return false
      }
      
      const next: any = this._pointOfInterestList[idx]

      this._targetWorldCoords[0] = glMatrix.toRadian(next.polarCoords[0])
      this._targetWorldCoords[1] = glMatrix.toRadian(-next.polarCoords[1] - 90)
      return true
    }

    nextPoint() {
      const currentPoint: any = this.findMostCenteredPoint()
      let idx: number = this._pointOfInterestList.findIndex(el => el == currentPoint)
      idx++
      idx %= this._pointOfInterestList.length
      const next: any = this._pointOfInterestList[idx]

      this._targetWorldCoords[0] = glMatrix.toRadian(next.polarCoords[0])
      this._targetWorldCoords[1] = glMatrix.toRadian(-next.polarCoords[1] - 90)
    }

    private recenter () {
      const selectedPoint: any = this.findMostCenteredPoint()
      if (!selectedPoint) {
        return
      }

      this._targetWorldCoords[0] = glMatrix.toRadian(selectedPoint.polarCoords[0])
      this._targetWorldCoords[1] = glMatrix.toRadian(-selectedPoint.polarCoords[1] - 90)
    }

    private populateScene () {
      if (!this._engine.renderingState) {
        return
      }
      const shaderProgram: ShaderProgram = new ShaderProgram(this._engine.renderingState, this._vsSource, this._fsSource)
      const worldTransform: Transform = new Transform()
      const rs: RenderingState = this._engine.renderingState
      const gl: WebGLRenderingContext = this._engine.renderingState.gl

      {
        this._worldEntity = new Entity()
        const material: Material = new Material(rs, shaderProgram)
        material.albedo = new Texture(gl, '/resources/states/textures/earth_whiteandalphaoutline_4k.png')
        material.color = vec4.fromValues(1, 1, 1, 1)
        const meshRenderer: MeshRenderer = new MeshRenderer(rs, icomesh(4), material)
        this._worldEntity.addComponent(meshRenderer)

        worldTransform.position = vec3.fromValues(0.0, 0.0, -2.5)
        worldTransform.scale = vec3.fromValues(1.0, 1.0, 1.0)

        worldTransform.onUpdate = (data) => {
          let speed = 1
          const pitchQuat:quat = quat.create()
          const targetWorldRotation:quat = quat.create()
          quat.setAxisAngle(pitchQuat, vec3.fromValues(1, 0, 0), this._targetWorldCoords[0])
          const yawQuat:quat = quat.create()
          quat.setAxisAngle(yawQuat, vec3.fromValues(0, 1, 0), this._targetWorldCoords[1])
          quat.mul(targetWorldRotation, pitchQuat, yawQuat)

          if (this._dragging) {
            speed = 4
          }

          quat.slerp(worldTransform.rotation, worldTransform.rotation, targetWorldRotation, speed * data.deltaTime)

          if (this._activePoint !== undefined) {
            this._activePoint.hideLocationDataPanel()
          }
          this._activePoint = this.findMostCenteredPoint(0.2)
          if (this._activePoint !== undefined) {
            this._activePoint.showLocationDataPanel()
          }
        }

        this._worldEntity.addComponent(worldTransform)
        this._scene.entityList.push(this._worldEntity)
      }

      {
        const madrid:PointOfInterest = new PointOfInterest(shaderProgram, rs, worldTransform)
        madrid.polarCoords = vec2.fromValues(40.4167, -3.70325)
        madrid.name = 'Madrid Hackathon'
        madrid.text = 'Quantum Hackathon in Madrid Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum tellus eget lacus blandit sodales.'
        this._pointOfInterestList.push(madrid)
        this._scene.entityList.push(madrid)

        const sudafrica:PointOfInterest = new PointOfInterest(shaderProgram, rs, worldTransform)
        sudafrica.polarCoords = vec2.fromValues(-30.559482, 22.937506)
        sudafrica.name = 'Sudafrica Qiskit Camp'
        sudafrica.text = 'Quantum Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum tellus eget lacus blandit sodales.'
        this._pointOfInterestList.push(sudafrica)
        this._scene.entityList.push(sudafrica)

        const nyc:PointOfInterest = new PointOfInterest(shaderProgram, rs, worldTransform)
        nyc.polarCoords = vec2.fromValues(40.6643, -73.9385)
        nyc.name = 'New York Quantum'
        nyc.text = 'Quantum Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rutrum tellus eget lacus blandit sodales.'
        this._pointOfInterestList.push(nyc)
        this._scene.entityList.push(nyc)

        /*
            for (let i:number = -18; i < 18; i++) {
                for (let j:number = 0; j < 10; j++) {
                    const test:PointOfInterest = new PointOfInterest(shaderProgram, rs, worldTransform);
                    test.polarCoords = vec2.fromValues(10*j, 10*i);
                    this._pointOfInterestList.push(test);
                    this._scene.entityList.push(test);
                }

            }
            */
        /*
            for (let i:number = -18; i < 18; i++) {
                const test:PointOfInterest = new PointOfInterest(shaderProgram, rs, worldTransform);
                test.polarCoords = vec2.fromValues(0, 10*i);
                this._pointOfInterestList.push(test);
                this._scene.entityList.push(test);
            }
            */
      }
    }
}
