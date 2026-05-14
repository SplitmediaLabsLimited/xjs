import { Item } from './item';
export interface IItemGroup {
    /**
     * return: Promise<Item[]>
     *
     * Get all the items present in the group
     *
     * #### Usage
     *
     * ```javascript
     * grpItem.getItems().then(function(items) {
     *  // do something to each item in items array
     * });
     * ```
     */
    getItems(): Promise<Item[]>;
    /**
     * param: (items: string || string[] || Item || Item[])
     * ```
     * return: Promise<Item[]>
     * ```
     *
     * Adds items into the group.
     * Accepts an item ID or Item object or an array of those.
     * Rejects when any of the provided items cannot be added into the group,
     * such as, but not limited to already added into the group or another group,
     * in another scene, or non-existent
     *
     * #### Usage
     *
     * ```javascript
     * var myItems;
     * Scene.getItems()
     * .then(function(items) {
     *   // assuming myItems[0] is the group Item
     *   // can be added as a single Item object
     *   myItems[0].addItems(myItems[2]);
     *   // or via the item's id
     *   myItems[0].addItems(myItems[3]._id);
     *   // or via an array of them
     *   myItems[0].addItems([myItems[4],myItems[5]]);
     * });
     * ```
     */
    addItems(itemArray: any): Promise<IItemGroup>;
    /**
     * param: (items: string || string[] || Item || Item[])
     * ```
     * return: Promise<Item[]>
     * ```
     *
     * Removes the items from the group.
     * This doesn't actually remove the item from the scene,
     * but only detaches itself from the group.
     * Accepts an item ID or Item object or an array of those.
     * Rejects when any of the provided items cannot be removed from the group,
     *
     * #### Usage
     *
     * ```javascript
     * var myItems;
     * Scene.getItems()
     * .then(function(items) {
     *   // assuming myItems[0] is the group Item
     *   // can remove a single Item object
     *   myItems[0].removeItems(myItems[2]);
     *   // or via the item's id
     *   myItems[0].removeItems(myItems[3]._id);
     *   // or via an array of them
     *   myItems[0].removeItems([myItems[4],myItems[5]]);
     * });
     * ```
     */
    removeItems(itemArray: any): Promise<IItemGroup>;
    /**
     * return: Promise<Item[]>
     *
     * Removes all the items within the group.
     * This doesn't actually remove the items from the scene,
     * but only detaches itself from the group.
     * This also persists the group item in the scene.
     * You would need to specifically remove the GroupItem if needed.
     *
     * #### Usage
     *
     * ```javascript
     * Scene.getItems()
     * .then(function(items) {
     *   if (myItems[0] instanceof XJS.GroupItem) {
     *     return myItems[0].unGroup();
     *   }
     * }).then(function() {
     *   myItems[0].remove()
     * });
     * ```
     */
    unGroup(): Promise<IItemGroup>;
}
export declare class ItemGroup implements IItemGroup {
    private _id;
    getItems(): Promise<Item[]>;
    addItems(items: any): Promise<ItemGroup>;
    removeItems(items: any): Promise<ItemGroup>;
    unGroup(): Promise<IItemGroup>;
}
