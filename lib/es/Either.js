"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Right = exports.Left = exports.Either = void 0;
const Maybe_1 = require("./Maybe");
exports.Either = {
    of(value) {
        return right(value);
    },
    lefts(list) {
        let result = [];
        for (const x of list) {
            if (x.isLeft()) {
                result.push(x.extract());
            }
        }
        return result;
    },
    rights(list) {
        let result = [];
        for (const x of list) {
            if (x.isRight()) {
                result.push(x.extract());
            }
        }
        return result;
    },
    encase(throwsF) {
        try {
            return right(throwsF());
        }
        catch (e) {
            return left(e);
        }
    },
    sequence(eithers) {
        let res = [];
        for (const e of eithers) {
            if (e.isLeft()) {
                return e;
            }
            res.push(e.extract());
        }
        return right(res);
    },
    isEither(x) {
        return x instanceof Left || x instanceof Right;
    },
    'fantasy-land/of'(value) {
        return exports.Either.of(value);
    }
};
class Right {
    constructor(__value) {
        this.__value = __value;
        this._ = 'R';
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    toJSON() {
        return this.__value;
    }
    inspect() {
        return `Right(${JSON.stringify(this.__value)})`;
    }
    toString() {
        return this.inspect();
    }
    bimap(_, g) {
        return right(g(this.__value));
    }
    map(f) {
        return right(f(this.__value));
    }
    mapLeft(_) {
        return this;
    }
    ap(other) {
        return other.isRight() ? this.map(other.extract()) : other;
    }
    equals(other) {
        return other.isRight() ? this.__value === other.extract() : false;
    }
    chain(f) {
        return f(this.__value);
    }
    chainLeft(_) {
        return this;
    }
    join() {
        return this.__value;
    }
    alt(_) {
        return this;
    }
    reduce(reducer, initialValue) {
        return reducer(initialValue, this.__value);
    }
    extend(f) {
        return right(f(this));
    }
    unsafeCoerce() {
        return this.__value;
    }
    caseOf(patterns) {
        return '_' in patterns ? patterns._() : patterns.Right(this.__value);
    }
    leftOrDefault(defaultValue) {
        return defaultValue;
    }
    orDefault(_) {
        return this.__value;
    }
    orDefaultLazy(_) {
        return this.__value;
    }
    leftOrDefaultLazy(getDefaultValue) {
        return getDefaultValue();
    }
    ifLeft(_) {
        return this;
    }
    ifRight(effect) {
        return effect(this.__value), this;
    }
    toMaybe() {
        return Maybe_1.Just(this.__value);
    }
    leftToMaybe() {
        return Maybe_1.Nothing;
    }
    either(_, ifRight) {
        return ifRight(this.__value);
    }
    extract() {
        return this.__value;
    }
    swap() {
        return left(this.__value);
    }
    'fantasy-land/bimap'(f, g) {
        return this.bimap(f, g);
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/ap'(other) {
        return this.ap(other);
    }
    'fantasy-land/equals'(other) {
        return this.equals(other);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    'fantasy-land/alt'(other) {
        return this.alt(other);
    }
    'fantasy-land/reduce'(reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    }
    'fantasy-land/extend'(f) {
        return this.extend(f);
    }
}
Right.prototype.constructor = exports.Either;
class Left {
    constructor(__value) {
        this.__value = __value;
        this._ = 'L';
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    toJSON() {
        return this.__value;
    }
    inspect() {
        return `Left(${JSON.stringify(this.__value)})`;
    }
    toString() {
        return this.inspect();
    }
    bimap(f, _) {
        return left(f(this.__value));
    }
    map(_) {
        return this;
    }
    mapLeft(f) {
        return left(f(this.__value));
    }
    ap(other) {
        return other.isLeft() ? other : this;
    }
    equals(other) {
        return other.isLeft() ? other.extract() === this.__value : false;
    }
    chain(_) {
        return this;
    }
    chainLeft(f) {
        return f(this.__value);
    }
    join() {
        return this;
    }
    alt(other) {
        return other;
    }
    reduce(_, initialValue) {
        return initialValue;
    }
    extend(_) {
        return this;
    }
    unsafeCoerce() {
        if (this.__value instanceof Error) {
            throw this.__value;
        }
        throw new Error('Either#unsafeCoerce was ran on a Left');
    }
    caseOf(patterns) {
        return '_' in patterns ? patterns._() : patterns.Left(this.__value);
    }
    leftOrDefault(_) {
        return this.__value;
    }
    orDefault(defaultValue) {
        return defaultValue;
    }
    orDefaultLazy(getDefaultValue) {
        return getDefaultValue();
    }
    leftOrDefaultLazy(_) {
        return this.__value;
    }
    ifLeft(effect) {
        return effect(this.__value), this;
    }
    ifRight(_) {
        return this;
    }
    toMaybe() {
        return Maybe_1.Nothing;
    }
    leftToMaybe() {
        return Maybe_1.Just(this.__value);
    }
    either(ifLeft, _) {
        return ifLeft(this.__value);
    }
    extract() {
        return this.__value;
    }
    swap() {
        return right(this.__value);
    }
    'fantasy-land/bimap'(f, g) {
        return this.bimap(f, g);
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/ap'(other) {
        return this.ap(other);
    }
    'fantasy-land/equals'(other) {
        return this.equals(other);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    'fantasy-land/alt'(other) {
        return this.alt(other);
    }
    'fantasy-land/reduce'(reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    }
    'fantasy-land/extend'(f) {
        return this.extend(f);
    }
}
Left.prototype.constructor = exports.Either;
const left = (value) => new Left(value);
exports.Left = left;
const right = (value) => new Right(value);
exports.Right = right;
