import { Entity } from './Entity'

export interface Component {

    update(deltaTime: number, entity : Entity) : void;
}
