import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Scene} from '../scene';
import {XML} from '../../internal/util/xml';
import {Logger} from '../../internal/util/logger';

export interface ISourceScene {
  /**
   * return: Promise<Scene>
   *
   * Gets the scene that is being displayed by the source
   */
  getScene(): Promise<Scene> 

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<SourceScene>
   * ```
   *
   * Sets the scene to be displayed displayed by the source
   */
  setScene(scene?: number | Scene): Promise<SourceScene>
}

export class SourceScene implements ISourceScene {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _sceneId: string;
  protected _checkPromise;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  protected _setScene (itemType: string, uid: string, name: string, resolve: Function, reject: Function) {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setScene', true)
      this._checkPromise = iItem.set('prop:srctype', `${itemType},${uid}`, this._id);
    } else {
      //wrapset
      this._checkPromise = iItem.wrapSet('prop:srctype', `${itemType},${uid}`,
        this._srcId, this._id, this._updateId.bind(this));
    }

    var code;
    this._checkPromise
    .then(result => {
      code = result;
      return iItem.set('prop:name', `Scene: ${name}`);
    }).then(() =>{
      if (code) {
        resolve(this);
      } else {
        reject(Error('Invalid value'));
      }
    }).catch(err => reject(err));
  }

  getScene(): Promise<Scene> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getURL', true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise
      .then(scene => {
        if (scene === '0') {
          resolve(Scene.liveScene());
        } else {
          return Scene.getBySceneUid(scene);
        }
      }).then(sceneObj => resolve(sceneObj))
      .catch(err => reject(err));
    })
  }

  setScene(scene?: number | Scene): Promise<SourceScene> {
    return new Promise((resolve, reject) => {
      if (scene instanceof Scene ||
        (typeof scene === 'number' && scene >= 0 && Number['isInteger'](Number(scene)))) {
          var itemType = '11';

          if (scene instanceof Scene) {
            var sceneUID = scene['_uid'];
            var name = scene['_name'];
            itemType = (sceneUID === "0") ? '14' : '11';
            this._setScene(itemType, sceneUID, name, resolve, reject);
          } else if (typeof scene === 'number') {
            var name = '';
            var targetScene;
            Scene.getBySceneIndex(scene)
            .then(sceneByID => {
              targetScene = sceneByID;
              return targetScene.getName();
            }).then(sceneName => {
              name = sceneName;
              return targetScene.getSceneUid();
            }).then(uid => {
              this._setScene(itemType, uid, name, resolve, reject);
            }).catch(err => reject(err))
          }
      } else {
        if (typeof scene === 'number' && (scene < 1 || !Number['isInteger'](Number(scene)))) {
          reject(Error('Invalid parameters. Valid range is greater than 0.'));
        } else {
          reject(Error('Invalid parameters. Valid range is greater than 0 or a Scene object.'));
        }
      }
    })
  }
}