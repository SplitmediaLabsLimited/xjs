import { Transition } from '../transition';
export interface IItemTransition {
    /**
     * return: Promise<boolean>
     *
     * Check if item is visible on stage
     */
    isVisible(): Promise<boolean>;
    /**
     * param: value<boolean>
     *
     * Set item to visible or hidden
     *
     * *Chainable.*
     */
    setVisible(value: boolean): Promise<IItemTransition>;
    /**
     * return: Promise<boolean>
     *
     * Get item's transition type for when visibility is toggled
     */
    getTransition(): Promise<Transition>;
    /**
     * param: value<Transition>
     *
     * Set item's transition type for when visibility is toggled
     *
     * *Chainable.*
     */
    setTransition(value: Transition): Promise<IItemTransition>;
    /**
     * return: Promise<number>
     *
     * Get item's transition time in milliseconds
     */
    getTransitionTime(): Promise<number>;
    /**
     * param: value<number>
     *
     * Set item's transition time in milliseconds
     *
     * *Chainable.*
     */
    setTransitionTime(value: number): Promise<IItemTransition>;
}
export declare class ItemTransition implements IItemTransition {
    private _id;
    isVisible(): Promise<boolean>;
    setVisible(value: boolean): Promise<ItemTransition>;
    getTransition(): Promise<Transition>;
    setTransition(value: Transition): Promise<ItemTransition>;
    getTransitionTime(): Promise<number>;
    setTransitionTime(value: number): Promise<ItemTransition>;
}
