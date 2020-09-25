/** The identity function, returns the value it was given */
export declare const identity: <T>(x: T) => T;
/** Returns a function that always returns the same value. Also known as `const` in other languages */
export declare const always: <T>(x: T) => <U>(y: U) => T;
export declare const enum Order {
    LT = "LT",
    EQ = "EQ",
    GT = "GT"
}
/** Compares two values using the default "<" and ">" operators */
export declare const compare: <T>(x: T, y: T) => Order;
/** Maps the Order enum to the values expected by the standard ECMAScript library when doing comparison (Array.prototype.sort, for example) */
export declare const orderToNumber: (order: Order) => number;
