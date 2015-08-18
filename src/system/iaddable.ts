import {Scene} from '../core/scene';

export interface Addable {
  addToScene(scene: Scene): Promise<boolean>;
}
