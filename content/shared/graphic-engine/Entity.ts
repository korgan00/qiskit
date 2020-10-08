import { Component } from './Component'
import { Drawable } from './Drawable'

export class Entity {
    private components : Map<string, Component>;
    private drawables : Map<string, Drawable>;

    constructor () {
      this.components = new Map<string, Component>()
      this.drawables = new Map<string, Drawable>()
    }

    addComponent<T extends Drawable | Component> (comp: T) {
      if ((comp as Component).update !== undefined) {
        this.components.set(typeof (comp), (comp as Component))
      }
      if ((comp as Drawable).draw !== undefined) {
        this.drawables.set(typeof (comp), (comp as Drawable))
      }
    }

    removeComponent<T extends Drawable | Component> () {
      const typeTest : T = <T>{}
      if ((typeTest as Component).update !== null) {
        this.components.delete(typeof (typeTest))
      }
      if ((typeTest as Drawable).draw !== null) {
        this.drawables.delete(typeof (typeTest))
      }
    }

    getComponent<T extends Drawable | Component> () : T | undefined {
      const typeTest:T = <T>{}
      if ((typeTest as Component).update !== null) {
        // console.log("Get Component: ");
        return <T> this.components.get(typeof (typeTest))
      }
      if ((typeTest as Drawable).draw !== null) {
        // console.log("Get Drawable: ");
        return <T> this.drawables.get(typeof (typeTest))
      }
      return undefined
    }

    update (deltaTime: number) : void {
      this.components.forEach((v, _, _m) => v.update(deltaTime, this))
    }

    draw () : void {
      this.drawables.forEach((v, _, _m) => v.draw(this))
    }
}
