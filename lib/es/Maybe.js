"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nothing = exports.Just = exports.Maybe = void 0;
const Either_1 = require("./Either");
exports.Maybe = {
    of(value) {
        return just(value);
    },
    empty() {
        return nothing;
    },
    zero() {
        return nothing;
    },
    fromNullable(value) {
        return value == null ? nothing : just(value);
    },
    fromFalsy(value) {
        return value ? just(value) : nothing;
    },
    fromPredicate(pred, value) {
        switch (arguments.length) {
            case 1:
                return (value) => exports.Maybe.fromPredicate(pred, value);
            default:
                return pred(value) ? just(value) : nothing;
        }
    },
    mapMaybe(f, list) {
        switch (arguments.length) {
            case 1:
                return (list) => exports.Maybe.mapMaybe(f, list);
            default:
                return exports.Maybe.catMaybes(list.map(f));
        }
    },
    catMaybes(list) {
        let res = [];
        for (const e of list) {
            if (e.isJust()) {
                res.push(e.extract());
            }
        }
        return res;
    },
    encase(thunk) {
        try {
            return just(thunk());
        }
        catch (_a) {
            return nothing;
        }
    },
    isMaybe(x) {
        return x instanceof Just || x instanceof Nothing;
    },
    'fantasy-land/of'(value) {
        return this.of(value);
    },
    'fantasy-land/empty'() {
        return this.empty();
    },
    'fantasy-land/zero'() {
        return this.zero();
    }
};
class Just {
    constructor(__value) {
        this.__value = __value;
    }
    isJust() {
        return true;
    }
    isNothing() {
        return false;
    }
    inspect() {
        return `Just(${JSON.stringify(this.__value)})`;
    }
    toString() {
        return this.inspect();
    }
    toJSON() {
        return this.__value;
    }
    equals(other) {
        return this.extract() === other.extract();
    }
    map(f) {
        return just(f(this.__value));
    }
    ap(maybeF) {
        return maybeF.isJust() ? this.map(maybeF.extract()) : nothing;
    }
    alt(_) {
        return this;
    }
    chain(f) {
        return f(this.__value);
    }
    chainNullable(f) {
        return exports.Maybe.fromNullable(f(this.__value));
    }
    join() {
        return this.__value;
    }
    reduce(reducer, initialValue) {
        return reducer(initialValue, this.__value);
    }
    extend(f) {
        return just(f(this));
    }
    unsafeCoerce() {
        return this.__value;
    }
    caseOf(patterns) {
        return '_' in patterns ? patterns._() : patterns.Just(this.__value);
    }
    orDefault(_) {
        return this.__value;
    }
    orDefaultLazy(_) {
        return this.__value;
    }
    toList() {
        return [this.__value];
    }
    mapOrDefault(f, _) {
        return f(this.__value);
    }
    extract() {
        return this.__value;
    }
    extractNullable() {
        return this.__value;
    }
    toEither(_) {
        return Either_1.Right(this.__value);
    }
    ifJust(effect) {
        return effect(this.__value), this;
    }
    ifNothing(_) {
        return this;
    }
    filter(pred) {
        return pred(this.__value) ? just(this.__value) : nothing;
    }
    'fantasy-land/equals'(other) {
        return this.equals(other);
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/ap'(maybeF) {
        return this.ap(maybeF);
    }
    'fantasy-land/alt'(other) {
        return this.alt(other);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    'fantasy-land/reduce'(reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    }
    'fantasy-land/extend'(f) {
        return this.extend(f);
    }
    'fantasy-land/filter'(pred) {
        return this.filter(pred);
    }
}
Just.prototype.constructor = exports.Maybe;
class Nothing {
    isJust() {
        return false;
    }
    isNothing() {
        return true;
    }
    inspect() {
        return 'Nothing';
    }
    toString() {
        return this.inspect();
    }
    toJSON() {
        return this.__value;
    }
    equals(other) {
        return this.extract() === other.extract();
    }
    map(_) {
        return nothing;
    }
    ap(_) {
        return nothing;
    }
    alt(other) {
        return other;
    }
    chain(_) {
        return nothing;
    }
    chainNullable(_) {
        return nothing;
    }
    join() {
        return nothing;
    }
    reduce(_, initialValue) {
        return initialValue;
    }
    extend(_) {
        return nothing;
    }
    unsafeCoerce() {
        throw new Error('Maybe#unsafeCoerce was ran on a Nothing');
    }
    caseOf(patterns) {
        return '_' in patterns ? patterns._() : patterns.Nothing();
    }
    orDefault(defaultValue) {
        return defaultValue;
    }
    orDefaultLazy(getDefaultValue) {
        return getDefaultValue();
    }
    toList() {
        return [];
    }
    mapOrDefault(_, defaultValue) {
        return defaultValue;
    }
    extract() {
        return undefined;
    }
    extractNullable() {
        return null;
    }
    toEither(left) {
        return Either_1.Left(left);
    }
    ifJust(_) {
        return this;
    }
    ifNothing(effect) {
        return effect(), this;
    }
    filter(_) {
        return nothing;
    }
    'fantasy-land/equals'(other) {
        return this.equals(other);
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/ap'(maybeF) {
        return this.ap(maybeF);
    }
    'fantasy-land/alt'(other) {
        return this.alt(other);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    'fantasy-land/reduce'(reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    }
    'fantasy-land/extend'(f) {
        return this.extend(f);
    }
    'fantasy-land/filter'(pred) {
        return this.filter(pred);
    }
}
Nothing.prototype.constructor = exports.Maybe;
/** Constructs a Just. Represents an optional value that exists */
const just = (value) => new Just(value);
exports.Just = just;
/** Represents a missing value, you can think of it as a smart 'null' */
const nothing = new Nothing();
exports.Nothing = nothing;
