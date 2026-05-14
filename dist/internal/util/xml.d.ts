import { JSON } from './json';
export declare class XML {
    private xml;
    private static RESERVED_ATTRIBUTES;
    constructor(json?: JSON);
    toString(): string;
    static parseJSON(json: JSON): XML;
    static encode(str: string): string;
}
