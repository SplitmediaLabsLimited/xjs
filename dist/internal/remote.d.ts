/**
 * This class is used as a middleware for communication for a remote and proxy
 * xjs. Receiving, Sending and Routing of messages is done here to make the
 * calls reach their supposed methods, be processed and then returned to the
 * caller as if it is just running locally.
 *
 * Note that this class does not create/handle the connection used to send/receive
 * messages and should be declared initially upon readying the xjs, together with
 * what type it is (remote/proxy).
 * You can use websockets, datachannnels, etc... for this.
 *
 * Initial declaration on ready:
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.ready({
 *  remote: {
 *    type: 'remote' // remote/proxy, default is local
 *    sendMessage: function(message) {
 *      myConnection.send(message) // this will be assigned to Remote.sendMessage
 *    }
 *  }
 * })
 *
 * // Then handle received messages(string) should be passed to
 * xjs.Remote.receiveMessage(message)
 * ```
 *
 * Once this is set up, you can already use xjs normally as if you are just making
 * calls locally.
 */
export declare class Remote {
    private static _isVersion;
    private static _RemoteTypes;
    /**
     * Initial assignment should be done on xjs.ready()
     * Assign preferred method of sending message.
     */
    static sendMessage: any;
    /**
     * Initial assignment should be done on xjs.ready()
     * Types:
     *  - local (default)
     *  - remote
     *  - proxy
     */
    static remoteType: string;
    /**
     * param: (value: string) / remoteType
     *
     * Allows user to set the remoteType.
     * May be used for instances that the extension may need to call a method locally.
     *
     * `Note: This may break handling of calls if the type is not returned to its original assignment`
     */
    static setRemoteType(val: string): Promise<unknown>;
    /**
     * param: (value: connection)
     *
     * Allows reassigning of `Remote.sendMessage` for instances when sending messages
     * is replaced.
     */
    static setSendMessage(newSendMessage: any): Promise<unknown>;
    /**
     * param: (value: string)
     *
     * Handles received messages to properly relay it to either the proxy
     * and make the actual calls, or remote and return the results from
     * proxy.
     *
     */
    static receiveMessage(message: string): Promise<unknown>;
    private static _execHandler;
    private static _eventEmitterHandler;
    private static _eventManagerHandler;
    private static _allWindowHandler;
}
