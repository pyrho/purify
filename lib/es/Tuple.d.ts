export interface TupleTypeRef {
    <F, S>(fst: F, snd: S): Tuple<F, S>;
    /** Applies two functions over a single value and constructs a tuple from the results */
    fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S, value: T): Tuple<F, S>;
    fanout<F, S, T>(f: (value: T) => F, g: (value: T) => S): (value: T) => Tuple<F, S>;
    fanout<F, T>(f: (value: T) => F): <S>(g: (value: T) => S) => (value: T) => Tuple<F, S>;
    /** Constructs a tuple from an array with two elements */
    fromArray<F, S>([fst, snd]: [F, S]): Tuple<F, S>;
}
export interface Tuple<F, S> extends Iterable<F | S>, ArrayLike<F | S> {
    0: F;
    1: S;
    [index: number]: F | S;
    length: 2;
    toJSON(): [F, S];
    inspect(): string;
    toString(): string;
    /** Returns the first value of `this` */
    fst(): F;
    /** Returns the second value of `this` */
    snd(): S;
    /** Compares the values inside `this` and another tuple */
    equals(other: Tuple<F, S>): boolean;
    /** Transforms the two values inside `this` with two mapper functions */
    bimap<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>;
    /** Applies a function to the first value of `this` */
    mapFirst<F2>(f: (fst: F) => F2): Tuple<F2, S>;
    /** Applies a function to the second value of `this` */
    map<S2>(f: (snd: S) => S2): Tuple<F, S2>;
    /** A somewhat arbitrary implementation of Foldable for Tuple, the reducer will be passed the initial value and the second value inside `this` as arguments */
    reduce<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T;
    /** Returns an array with 2 elements - the values inside `this` */
    toArray(): [F, S];
    /** Swaps the values inside `this` */
    swap(): Tuple<S, F>;
    /** Applies the second value of a tuple to the second value of `this` */
    ap<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>;
    /** Tests whether both elements in the tuple pass the test implemented by the provided function */
    every(pred: (value: F | S) => boolean): boolean;
    /** Tests whether at least one element in the tuple passes the test implemented by the provided function */
    some(pred: (value: F | S) => boolean): boolean;
    'fantasy-land/equals'(other: Tuple<F, S>): boolean;
    'fantasy-land/bimap'<F2, S2>(f: (fst: F) => F2, g: (snd: S) => S2): Tuple<F2, S2>;
    'fantasy-land/map'<S2>(f: (snd: S) => S2): Tuple<F, S2>;
    'fantasy-land/reduce'<T>(reducer: (accumulator: T, value: S) => T, initialValue: T): T;
    'fantasy-land/ap'<T, S2>(f: Tuple<T, (value: S) => S2>): Tuple<F, S2>;
}
export declare const Tuple: TupleTypeRef;
