import { Source } from './source';
import { ISourcePlayback, ActionAfterPlayback } from './iplayback';
import { IAudio } from './iaudio';
import { CuePoint } from './cuepoint';
import { ISourceMedia } from './imedia';
export declare const MediaTypes: string[];
/**
 * The MediaSource class represents the sources of the media items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the MediaItem class.
 * See: {@link #core/MediaItem Core/MediaItem}
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *   for (var i in sources) {
 *       if (sources[i] instanceof XJS.MediaSource) {
 *         // Manipulate your media source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `MediaSource`
 * instance.
 */
export declare class MediaSource extends Source implements ISourcePlayback, IAudio, ISourceMedia {
    /**
     * See: {@link #core/ISourceMedia#getFileInfo getFileInfo}
     */
    getFileInfo: () => Promise<Object>;
    /**
     * See: {@link #core/ISourceMedia#isSourceAvailable isSourceAvailable}
     */
    isSourceAvailable: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#isAudio isAudio}
     */
    isAudio: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#isVideo isVideo}
     */
    isVideo: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#isSeekable isSeekable}
     */
    isSeekable: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#getPlaybackPosition getPlaybackPosition}
     */
    getPlaybackPosition: () => Promise<number>;
    /**
     * See: {@link #core/ISourcePlayback#setPlaybackPosition setPlaybackPosition}
     */
    setPlaybackPosition: (value: number) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#getPlaybackDuration getPlaybackDuration}
     */
    getPlaybackDuration: () => Promise<number>;
    /**
     * See: {@link #core/ISourcePlayback#isPlaying isPlaying}
     */
    isPlaying: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#setPlaying setPlaying}
     */
    setPlaying: (value: boolean) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#getPlaybackStartPosition getPlaybackStartPosition}
     */
    getPlaybackStartPosition: () => Promise<number>;
    /**
     * See: {@link #core/ISourcePlayback#setPlaybackStartPosition setPlaybackStartPosition}
     */
    setPlaybackStartPosition: (value: number) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#getPlaybackEndPosition getPlaybackEndPosition}
     */
    getPlaybackEndPosition: () => Promise<number>;
    /**
     * See: {@link #core/ISourcePlayback#setPlaybackEndPosition setPlaybackEndPosition}
     */
    setPlaybackEndPosition: (value: number) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#getActionAfterPlayback getActionAfterPlayback}
     */
    getActionAfterPlayback: () => Promise<ActionAfterPlayback>;
    /**
     * See: {@link #core/ISourcePlayback#setActionAfterPlayback setActionAfterPlayback}
     */
    setActionAfterPlayback: (value: ActionAfterPlayback) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#isAutostartOnSceneLoad isAutostartOnSceneLoad}
     */
    isAutostartOnSceneLoad: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#setAutostartOnSceneLoad setAutostartOnSceneLoad}
     */
    setAutostartOnSceneLoad: (value: boolean) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#isForceDeinterlace isForceDeinterlace}
     */
    isForceDeinterlace: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#setForceDeinterlace setForceDeinterlace}
     */
    setForceDeinterlace: (value: boolean) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#isRememberingPlaybackPosition isRememberingPlaybackPosition}
     */
    isRememberingPlaybackPosition: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#setRememberingPlaybackPosition setRememberingPlaybackPosition}
     */
    setRememberingPlaybackPosition: (value: boolean) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#isShowingPlaybackPosition isShowingPlaybackPosition}
     */
    isShowingPlaybackPosition: () => Promise<boolean>;
    /**
     * See: {@link #core/ISourcePlayback#setShowingPlaybackPosition setShowingPlaybackPosition}
     */
    setShowingPlaybackPosition: (value: boolean) => Promise<MediaSource>;
    /**
     * See: {@link #core/ISourcePlayback#getCuePoints getCuePoints}
     */
    getCuePoints: () => Promise<CuePoint[]>;
    /**
     * See: {@link #core/ISourcePlayback#setCuePoints setCuePoints}
     */
    setCuePoints: (value: CuePoint[]) => Promise<MediaSource>;
    /** See: {@link #core/IAudio#getVolume getVolume} */
    getVolume: () => Promise<number>;
    /** See: {@link #core/IAudio#isMute isMute} */
    isMute: () => Promise<boolean>;
    /** See: {@link #core/IAudio#isAutoMute isAutoMute} */
    isAutoMute: () => Promise<boolean>;
    /** See: {@link #core/IAudio#setVolume setVolume} */
    setVolume: (value: number) => Promise<MediaSource>;
    /** See: {@link #core/IAudio#setMute setMute} */
    setMute: (value: boolean) => Promise<MediaSource>;
    /** See: {@link #core/IAudio#setAutoMute setAutoMute} */
    setAutoMute: (value: boolean) => Promise<MediaSource>;
    /** See: {@link #core/IAudio#isStreamOnlyAudio isStreamOnlyAudio} */
    isStreamOnlyAudio: () => Promise<boolean>;
    /** See: {@link #core/IAudio#setStreamOnlyAudio setStreamOnlyAudio} */
    setStreamOnlyAudio: (value: boolean) => Promise<MediaSource>;
    /** See: {@link #core/IAudio#isAudioAvailable isAudioAvailable} */
    isAudioAvailable: () => Promise<boolean>;
}
