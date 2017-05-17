import {Scene} from '../core/scene';

export interface Addable {
  addToScene(value: number | Scene ): Promise<boolean>;
}
