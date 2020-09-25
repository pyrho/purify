"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nothing = exports.Just = exports.Maybe = void 0;
var Either_1 = require("./Either");
exports.Maybe = {
    of: function (value) {
        return just(value);
    },
    empty: function () {
        return nothing;
    },
    zero: function () {
        return nothing;
    },
    fromNullable: function (value) {
        return value == null ? nothing : just(value);
    },
    fromFalsy: function (value) {
        return value ? just(value) : nothing;
    },
    fromPredicate: function (pred, value) {
        switch (arguments.length) {
            case 1:
                return function (value) { return exports.Maybe.fromPredicate(pred, value); };
            default:
                return pred(value) ? just(value) : nothing;
        }
    },
    mapMaybe: function (f, list) {
        switch (arguments.length) {
            case 1:
                return function (list) { return exports.Maybe.mapMaybe(f, list); };
            default:
                return exports.Maybe.catMaybes(list.map(f));
        }
    },
    catMaybes: function (list) {
        var e_1, _a;
        var res = [];
        try {
            for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                var e = list_1_1.value;
                if (e.isJust()) {
                    res.push(e.extract());
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    },
    encase: function (thunk) {
        try {
            return just(thunk());
        }
        catch (_a) {
            return nothing;
        }
    },
    isMaybe: function (x) {
        return x instanceof Just || x instanceof Nothing;
    },
    'fantasy-land/of': function (value) {
        return this.of(value);
    },
    'fantasy-land/empty': function () {
        return this.empty();
    },
    'fantasy-land/zero': function () {
        return this.zero();
    }
};
var Just = /** @class */ (function () {
    function Just(__value) {
        this.__value = __value;
    }
    Just.prototype.isJust = function () {
        return true;
    };
    Just.prototype.isNothing = function () {
        return false;
    };
    Just.prototype.inspect = function () {
        return "Just(" + JSON.stringify(this.__value) + ")";
    };
    Just.prototype.toString = function () {
        return this.inspect();
    };
    Just.prototype.toJSON = function () {
        return this.__value;
    };
    Just.prototype.equals = function (other) {
        return this.extract() === other.extract();
    };
    Just.prototype.map = function (f) {
        return just(f(this.__value));
    };
    Just.prototype.ap = function (maybeF) {
        return maybeF.isJust() ? this.map(maybeF.extract()) : nothing;
    };
    Just.prototype.alt = function (_) {
        return this;
    };
    Just.prototype.chain = function (f) {
        return f(this.__value);
    };
    Just.prototype.chainNullable = function (f) {
        return exports.Maybe.fromNullable(f(this.__value));
    };
    Just.prototype.join = function () {
        return this.__value;
    };
    Just.prototype.reduce = function (reducer, initialValue) {
        return reducer(initialValue, this.__value);
    };
    Just.prototype.extend = function (f) {
        return just(f(this));
    };
    Just.prototype.unsafeCoerce = function () {
        return this.__value;
    };
    Just.prototype.caseOf = function (patterns) {
        return '_' in patterns ? patterns._() : patterns.Just(this.__value);
    };
    Just.prototype.orDefault = function (_) {
        return this.__value;
    };
    Just.prototype.orDefaultLazy = function (_) {
        return this.__value;
    };
    Just.prototype.toList = function () {
        return [this.__value];
    };
    Just.prototype.mapOrDefault = function (f, _) {
        return f(this.__value);
    };
    Just.prototype.extract = function () {
        return this.__value;
    };
    Just.prototype.extractNullable = function () {
        return this.__value;
    };
    Just.prototype.toEither = function (_) {
        return Either_1.Right(this.__value);
    };
    Just.prototype.ifJust = function (effect) {
        return effect(this.__value), this;
    };
    Just.prototype.ifNothing = function (_) {
        return this;
    };
    Just.prototype.filter = function (pred) {
        return pred(this.__value) ? just(this.__value) : nothing;
    };
    Just.prototype['fantasy-land/equals'] = function (other) {
        return this.equals(other);
    };
    Just.prototype['fantasy-land/map'] = function (f) {
        return this.map(f);
    };
    Just.prototype['fantasy-land/ap'] = function (maybeF) {
        return this.ap(maybeF);
    };
    Just.prototype['fantasy-land/alt'] = function (other) {
        return this.alt(other);
    };
    Just.prototype['fantasy-land/chain'] = function (f) {
        return this.chain(f);
    };
    Just.prototype['fantasy-land/reduce'] = function (reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    };
    Just.prototype['fantasy-land/extend'] = function (f) {
        return this.extend(f);
    };
    Just.prototype['fantasy-land/filter'] = function (pred) {
        return this.filter(pred);
    };
    return Just;
}());
Just.prototype.constructor = exports.Maybe;
var Nothing = /** @class */ (function () {
    function Nothing() {
    }
    Nothing.prototype.isJust = function () {
        return false;
    };
    Nothing.prototype.isNothing = function () {
        return true;
    };
    Nothing.prototype.inspect = function () {
        return 'Nothing';
    };
    Nothing.prototype.toString = function () {
        return this.inspect();
    };
    Nothing.prototype.toJSON = function () {
        return this.__value;
    };
    Nothing.prototype.equals = function (other) {
        return this.extract() === other.extract();
    };
    Nothing.prototype.map = function (_) {
        return nothing;
    };
    Nothing.prototype.ap = function (_) {
        return nothing;
    };
    Nothing.prototype.alt = function (other) {
        return other;
    };
    Nothing.prototype.chain = function (_) {
        return nothing;
    };
    Nothing.prototype.chainNullable = function (_) {
        return nothing;
    };
    Nothing.prototype.join = function () {
        return nothing;
    };
    Nothing.prototype.reduce = function (_, initialValue) {
        return initialValue;
    };
    Nothing.prototype.extend = function (_) {
        return nothing;
    };
    Nothing.prototype.unsafeCoerce = function () {
        throw new Error('Maybe#unsafeCoerce was ran on a Nothing');
    };
    Nothing.prototype.caseOf = function (patterns) {
        return '_' in patterns ? patterns._() : patterns.Nothing();
    };
    Nothing.prototype.orDefault = function (defaultValue) {
        return defaultValue;
    };
    Nothing.prototype.orDefaultLazy = function (getDefaultValue) {
        return getDefaultValue();
    };
    Nothing.prototype.toList = function () {
        return [];
    };
    Nothing.prototype.mapOrDefault = function (_, defaultValue) {
        return defaultValue;
    };
    Nothing.prototype.extract = function () {
        return undefined;
    };
    Nothing.prototype.extractNullable = function () {
        return null;
    };
    Nothing.prototype.toEither = function (left) {
        return Either_1.Left(left);
    };
    Nothing.prototype.ifJust = function (_) {
        return this;
    };
    Nothing.prototype.ifNothing = function (effect) {
        return effect(), this;
    };
    Nothing.prototype.filter = function (_) {
        return nothing;
    };
    Nothing.prototype['fantasy-land/equals'] = function (other) {
        return this.equals(other);
    };
    Nothing.prototype['fantasy-land/map'] = function (f) {
        return this.map(f);
    };
    Nothing.prototype['fantasy-land/ap'] = function (maybeF) {
        return this.ap(maybeF);
    };
    Nothing.prototype['fantasy-land/alt'] = function (other) {
        return this.alt(other);
    };
    Nothing.prototype['fantasy-land/chain'] = function (f) {
        return this.chain(f);
    };
    Nothing.prototype['fantasy-land/reduce'] = function (reducer, initialValue) {
        return this.reduce(reducer, initialValue);
    };
    Nothing.prototype['fantasy-land/extend'] = function (f) {
        return this.extend(f);
    };
    Nothing.prototype['fantasy-land/filter'] = function (pred) {
        return this.filter(pred);
    };
    return Nothing;
}());
Nothing.prototype.constructor = exports.Maybe;
/** Constructs a Just. Represents an optional value that exists */
var just = function (value) { return new Just(value); };
exports.Just = just;
/** Represents a missing value, you can think of it as a smart 'null' */
var nothing = new Nothing();
exports.Nothing = nothing;
