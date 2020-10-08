import { Entity } from './Entity'

export interface Drawable {
    draw(entity : Entity) : void;
}
