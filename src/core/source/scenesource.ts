/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {ISourceScene, SourceScene} from '../source/iscene';
import {Scene} from '../scene';

export class SceneSource extends Source implements ISourceScene {
	getScene: () => Promise<Scene>

	setScene: (scene?: number | Scene) => Promise<SourceScene>
}

applyMixins(SceneSource, [SourceScene])