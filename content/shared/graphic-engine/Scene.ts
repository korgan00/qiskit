import { Entity } from './Entity'

export class Scene {
    entityList: Entity[];

    constructor () {
      this.entityList = []
    }

    update (deltaTime: number) :void {
      this.entityList.forEach(ntt => ntt.update(deltaTime))
    }

    draw () :void {
      this.entityList.forEach(ntt => ntt.draw())
    }
}
