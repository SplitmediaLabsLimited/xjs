export class Transition {
  private value: string;
  private key: string;

  private static _transitionMap = {
    NONE: '',
    CLOCK: 'clock',
    COLLAPSE: 'collapse',
    FADE: 'fade',
    FAN: 'fan',
    HOLE: 'hole',
    MOVE_BOTTOM: 'move_bottom',
    MOVE_LEFT: 'move_left',
    MOVE_LEFT_RIGHT: 'move_left_right',
    MOVE_RIGHT: 'move_right',
    MOVE_TOP: 'move_top',
    MOVE_TOP_BOTTOM: 'move_top_bottom',
    WAVE: 'wave'
  }

  static NONE: Transition =  new Transition('NONE');
  static CLOCK: Transition =  new Transition('CLOCK');
  static COLLAPSE: Transition =  new Transition('COLLAPSE');
  static FADE: Transition =  new Transition('FADE');
  static FAN: Transition =  new Transition('FAN');
  static HOLE: Transition =  new Transition('HOLE');
  static MOVE_BOTTOM: Transition =  new Transition('MOVE_BOTTOM');
  static MOVE_LEFT: Transition =  new Transition('MOVE_LEFT');
  static MOVE_LEFT_RIGHT: Transition =  new Transition('MOVE_LEFT_RIGHT');
  static MOVE_RIGHT: Transition =  new Transition('MOVE_RIGHT');
  static MOVE_TOP: Transition =  new Transition('MOVE_TOP');
  static MOVE_TOP_BOTTOM: Transition =  new Transition('MOVE_TOP_BOTTOM');
  static WAVE: Transition =  new Transition('WAVE');

  constructor(key: string) {
    this.key = key; // retain key so that NONE is readable
    this.value = Transition._transitionMap[key];
  }

  // should only be used internally when setting a property
  toString(): string {
    return this.value;
  }

  /** Converts this transition object to a easily identifiable string such as
   *  'NONE'.
   */
  toTransitionKey(): string {
    return this.key;
  }
}
