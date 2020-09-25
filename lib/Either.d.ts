import { Maybe } from './Maybe';
export declare type EitherPatterns<L, R, T> = {
    Left: (l: L) => T;
    Right: (r: R) => T;
} | {
    _: () => T;
};
export interface Either<L, R> {
    /** Returns true if `this` is `Left`, otherwise it returns false */
    isLeft(): this is Either<L, never>;
    /** Returns true if `this` is `Right`, otherwise it returns false */
    isRight(): this is Either<never, R>;
    toJSON(): L | R;
    inspect(): string;
    toString(): string;
    /** Given two functions, maps the value inside `this` using the first if `this` is `Left` or using the second one if `this` is `Right`.
     * If both functions return the same type consider using `Either#either` instead
     */
    bimap<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>;
    /** Maps the `Right` value of `this`, acts like an identity if `this` is `Left` */
    map<R2>(f: (value: R) => R2): Either<L, R2>;
    /** Maps the `Left` value of `this`, acts like an identity if `this` is `Right` */
    mapLeft<L2>(f: (value: L) => L2): Either<L2, R>;
    /** Applies a `Right` function over a `Right` value. Returns `Left` if either `this` or the function are `Left` */
    ap<R2>(other: Either<L, (value: R) => R2>): Either<L, R2>;
    /** Compares `this` to another `Either`, returns false if the constructors or the values inside are different, e.g. `Right(5).equals(Left(5))` is false */
    equals(other: Either<L, R>): boolean;
    /** Transforms `this` with a function that returns an `Either`. Useful for chaining many computations that may fail */
    chain<R2>(f: (value: R) => Either<L, R2>): Either<L, R2>;
    /** The same as Either#chain but executes the transformation function only if the value is Left. Useful for recovering from errors */
    chainLeft<L2>(f: (value: L) => Either<L2, R>): Either<L2, R>;
    /** Flattens nested Eithers. `e.join()` is equivalent to `e.chain(x => x)` */
    join<R2>(this: Either<L, Either<L, R2>>): Either<L, R2>;
    /** Returns the first `Right` between `this` and another `Either` or the `Left` in the argument if both `this` and the argument are `Left` */
    alt(other: Either<L, R>): Either<L, R>;
    /** Takes a reducer and an initial value and returns the initial value if `this` is `Left` or the result of applying the function to the initial value and the value inside `this` */
    reduce<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T;
    /** Returns `this` if it's a `Left`, otherwise it returns the result of applying the function argument to `this` and wrapping it in a `Right` */
    extend<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>;
    /** Returns the value inside `this` if it's a `Right` or either throws the value or a generic exception depending on whether the value is an Error */
    unsafeCoerce(): R;
    /** Structural pattern matching for `Either` in the form of a function */
    caseOf<T>(patterns: EitherPatterns<L, R, T>): T;
    /** Returns the value inside `this` if it\'s `Left` or a default value if `this` is `Right` */
    leftOrDefault(defaultValue: L): L;
    /** Returns the value inside `this` if it\'s `Right` or a default value if `this` is `Left` */
    orDefault(defaultValue: R): R;
    /** Lazy version of `orDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Left` */
    orDefaultLazy(getDefaultValue: () => R): R;
    /** Lazy version of `leftOrDefault`. Takes a function that returns the default value, that function will be called only if `this` is `Right` */
    leftOrDefaultLazy(getDefaultValue: () => L): L;
    /** Runs an effect if `this` is `Left`, returns `this` to make chaining other methods possible */
    ifLeft(effect: (value: L) => any): this;
    /** Runs an effect if `this` is `Right`, returns `this` to make chaining other methods possible */
    ifRight(effect: (value: R) => any): this;
    /** Constructs a `Just` with the value of `this` if it\'s `Right` or a `Nothing` if `this` is `Left` */
    toMaybe(): Maybe<R>;
    /** Constructs a `Just` with the value of `this` if it\'s `Left` or a `Nothing` if `this` is `Right` */
    leftToMaybe(): Maybe<L>;
    /** Given two map functions, maps using the first if `this` is `Left` or using the second one if `this` is `Right`.
     * If you want the functions to return different types depending on the either you may want to use `Either#bimap` instead
     * */
    either<T>(ifLeft: (value: L) => T, ifRight: (value: R) => T): T;
    /** Extracts the value out of `this` */
    extract(): L | R;
    /** Returns `Right` if `this` is `Left` and vice versa */
    swap(): Either<R, L>;
    'fantasy-land/bimap'<L2, R2>(f: (value: L) => L2, g: (value: R) => R2): Either<L2, R2>;
    'fantasy-land/map'<R2>(f: (value: R) => R2): Either<L, R2>;
    'fantasy-land/ap'<R2>(other: Either<L, (value: R) => R2>): Either<L, R2>;
    'fantasy-land/equals'(other: Either<L, R>): boolean;
    'fantasy-land/chain'<R2>(f: (value: R) => Either<L, R2>): Either<L, R2>;
    'fantasy-land/alt'(other: Either<L, R>): Either<L, R>;
    'fantasy-land/reduce'<T>(reducer: (accumulator: T, value: R) => T, initialValue: T): T;
    'fantasy-land/extend'<R2>(f: (value: Either<L, R>) => R2): Either<L, R2>;
}
interface EitherTypeRef {
    /** Takes a value and wraps it in a `Right` */
    of<L, R>(value: R): Either<L, R>;
    /** Takes a list of `Either`s and returns a list of all `Left` values */
    lefts<L, R>(list: Either<L, R>[]): L[];
    /** Takes a list of `Either`s and returns a list of all `Right` values */
    rights<L, R>(list: Either<L, R>[]): R[];
    /** Calls a function and returns a `Right` with the return value or an exception wrapped in a `Left` in case of failure */
    encase<L extends Error, R>(throwsF: () => R): Either<L, R>;
    /** Turns a list of `Either`s into an `Either` of list */
    sequence<L, R>(eithers: Either<L, R>[]): Either<L, R[]>;
    isEither<L, R>(x: unknown): x is Either<L, R>;
    'fantasy-land/of'<L, R>(value: R): Either<L, R>;
}
export declare const Either: EitherTypeRef;
declare const left: <L, R = never>(value: L) => Either<L, R>;
declare const right: <R, L = never>(value: R) => Either<L, R>;
export { left as Left, right as Right };
