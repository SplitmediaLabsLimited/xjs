/**
 * The Transition class represents a preset transition within XSplit Broadcaster.
 * This may be used to set the application's transition scheme when switching scenes,
 * or to set an individual item's transition when its visibility changes.
 *
 * Simply use one of the available Transition objects such as Transition.FAN or
 * Transition.COLLAPSE as the parameter to the `setTransition()` method of an
 * App instance, or a valid Item instance that supports transitions (this
 * includes {@link #core/CameraItem Core/CameraItem},
 * {@link #core/FlashItem Core/FlashItem},
 * {@link #core/GameItem Core/GameItem},
 * {@link #core/HtmlItem Core/HtmlItem},
 * {@link #core/ImageItem Core/ImageItem},
 * {@link #core/MediaItem Core/MediaItem}, and
 * {@link #core/ScreenItem Core/ScreenItem}.)
 *
 * For scene transitions, you can also use custom stinger transitions,
 * which are exposed through the static method Transition.getSceneTransitions
 */
export declare class Transition {
    private _value;
    private _key;
    private static _transitionMap;
    static NONE: Transition;
    static CLOCK: Transition;
    static COLLAPSE: Transition;
    static FADE: Transition;
    static FAN: Transition;
    static HOLE: Transition;
    static MOVE_BOTTOM: Transition;
    static MOVE_LEFT: Transition;
    static MOVE_LEFT_RIGHT: Transition;
    static MOVE_RIGHT: Transition;
    static MOVE_TOP: Transition;
    static MOVE_TOP_BOTTOM: Transition;
    static WAVE: Transition;
    constructor(key: string, setValue?: any);
    /**
     * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
     */
    toString(): string;
    /**
     * Converts this transition object to a easily identifiable string such as 'NONE'.
     */
    toTransitionKey(): string;
    /**
     * return: Promise<Transition[]>
     *
     * Get all available transitions for use in scene change
     *
     * ** MINIMUM XBC REQUIREMENT **
     * requires XBC v.2.7.1602.0502 and above
     *
     * #### Usage
     *
     * ```javascript
     * Transtition.getSceneTransitions().then(function(transitions) {
     *   for (var i = 0; i < transitions.length; i++) {
     *     transitions.toString(); // Returns the value of the transition
     *     transitions.toTransitionKey(); // Returns the key of the transition
     *   }
     * })
     * ```
     */
    static getSceneTransitions(): Promise<Transition[]>;
}
