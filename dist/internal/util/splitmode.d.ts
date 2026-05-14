/**
 * Check if splitmode is active
 */
import { Scene } from '../../core/scene';
/**
 * return: value<number>
 *
 * Returns splitmode value
 */
export declare function splitMode(): Promise<number>;
/**
 * Used on addToScene methods
 */
export declare function checkSplitmode(value?: number | Scene): any;
