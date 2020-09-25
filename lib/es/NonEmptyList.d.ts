import { Maybe } from './Maybe';
import { Tuple } from './Tuple';
export declare type NonEmptyListCompliant<T> = T[] & {
    0: T;
};
export interface NonEmptyList<T> extends NonEmptyListCompliant<T> {
    map<U>(this: NonEmptyList<T>, callbackfn: (value: T, index: number, array: NonEmptyList<T>) => U, thisArg?: any): NonEmptyList<U>;
    reverse(this: NonEmptyList<T>): NonEmptyList<T>;
}
export interface NonEmptyListTypeRef {
    /** Typecasts an array with at least one element into a `NonEmptyList`. Works only if the compiler can confirm that the array has one or more elements */
    <T extends NonEmptyListCompliant<T[number]>>(list: T): NonEmptyList<T[number]>;
    /** Returns a `Just NonEmptyList` if the parameter has one or more elements, otherwise it returns `Nothing` */
    fromArray<T>(source: T[]): Maybe<NonEmptyList<T>>;
    /** Converts a `Tuple` to a `NonEmptyList` */
    fromTuple<T, U>(source: Tuple<T, U>): NonEmptyList<T | U>;
    /** Typecasts any array into a `NonEmptyList`, but throws an exception if the array is empty. Use `fromArray` as a safe alternative */
    unsafeCoerce<T>(source: T[]): NonEmptyList<T>;
    /** Returns true and narrows the type if the passed array has one or more elements */
    isNonEmpty<T>(list: T[]): list is NonEmptyList<T>;
    /** The same function as \`List#head\`, but it doesn't return a Maybe as a NonEmptyList will always have a head */
    head<T>(list: NonEmptyList<T>): T;
    /** The same function as \`List#last\`, but it doesn't return a Maybe as a NonEmptyList will always have a last element */
    last<T>(list: NonEmptyList<T>): T;
    /** The same function as \`List#tail\`, but it doesn't return a Maybe as a NonEmptyList will always have a tail (although it may be of length 0) */
    tail<T>(list: NonEmptyList<T>): T[];
}
export declare const NonEmptyList: NonEmptyListTypeRef;
