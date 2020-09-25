import { Tuple } from './Tuple';
import { Maybe } from './Maybe';
import { Order } from './Function';
/** Returns the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.find */
declare function find<T>(f: (x: T, index: number, arr: T[]) => boolean, list: T[]): Maybe<T>;
declare function find<T>(f: (x: T, index: number, arr: T[]) => boolean): (list: T[]) => Maybe<T>;
/** Returns the index of the first element which satisfies a predicate. A more typesafe version of the already existing List.prototype.findIndex */
declare function findIndex<T>(f: (x: T, index: number, arr: T[]) => boolean, list: T[]): Maybe<number>;
declare function findIndex<T>(f: (x: T, index: number, arr: T[]) => boolean): (list: T[]) => Maybe<number>;
/** Returns the element at a given index of a list */
declare function at<T>(index: number, list: T[]): Maybe<T>;
declare function at<T>(index: number): (list: T[]) => Maybe<T>;
/** Sorts an array with the given comparison function */
declare function sort<T>(compare: (a: T, b: T) => Order, list: T[]): T[];
declare function sort<T>(compare: (a: T, b: T) => Order): (list: T[]) => T[];
export declare const List: {
    init: <T>(list: T[]) => Maybe<T[]>;
    uncons: <T_1>(list: T_1[]) => Maybe<Tuple<T_1, T_1[]>>;
    at: typeof at;
    head: <T_2>(list: T_2[]) => Maybe<T_2>;
    last: <T_3>(list: T_3[]) => Maybe<T_3>;
    tail: <T_4>(list: T_4[]) => Maybe<T_4[]>;
    find: typeof find;
    findIndex: typeof findIndex;
    sum: (list: number[]) => number;
    sort: typeof sort;
};
export {};
