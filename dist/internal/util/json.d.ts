export declare class JSON {
    tag: string;
    children: JSON[];
    value: string;
    selfclosing: boolean;
    constructor(xml?: any);
    static parse(xml: any): JSON;
}
