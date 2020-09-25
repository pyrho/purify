"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaybeAsync = void 0;
var Maybe_1 = require("./Maybe");
var EitherAsync_1 = require("./EitherAsync");
var helpers = {
    liftMaybe: function (maybe) {
        if (maybe.isJust()) {
            return Promise.resolve(maybe.extract());
        }
        throw Maybe_1.Nothing;
    },
    fromPromise: function (promise) {
        return promise.then(helpers.liftMaybe);
    }
};
var MaybeAsyncImpl = /** @class */ (function () {
    function MaybeAsyncImpl(runPromise) {
        this.runPromise = runPromise;
        this[Symbol.toStringTag] = 'MaybeAsync';
        this['fantasy-land/ap'] = this.ap;
        this['fantasy-land/alt'] = this.alt;
        this['fantasy-land/extend'] = this.extend;
        this['fantasy-land/filter'] = this.filter;
    }
    MaybeAsyncImpl.prototype.orDefault = function (defaultValue) {
        return __awaiter(this, void 0, void 0, function () {
            var maybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        maybe = _a.sent();
                        return [2 /*return*/, maybe.orDefault(defaultValue)];
                }
            });
        });
    };
    MaybeAsyncImpl.prototype.join = function () {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var maybe, nestedMaybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        maybe = _a.sent();
                        if (!maybe.isJust()) return [3 /*break*/, 3];
                        return [4 /*yield*/, maybe.extract()];
                    case 2:
                        nestedMaybe = _a.sent();
                        return [2 /*return*/, helpers.liftMaybe(nestedMaybe)];
                    case 3: return [2 /*return*/, helpers.liftMaybe(Maybe_1.Nothing)];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.ap = function (maybeF) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var value, maybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        value = _a.sent();
                        return [4 /*yield*/, maybeF];
                    case 2:
                        maybe = _a.sent();
                        return [2 /*return*/, helpers.liftMaybe(value.ap(maybe))];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.alt = function (other) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var value, maybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        value = _a.sent();
                        return [4 /*yield*/, other];
                    case 2:
                        maybe = _a.sent();
                        return [2 /*return*/, helpers.liftMaybe(value.alt(maybe))];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.extend = function (f) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var maybe, v;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        maybe = _a.sent();
                        if (maybe.isJust()) {
                            v = exports.MaybeAsync.liftMaybe(maybe);
                            return [2 /*return*/, helpers.liftMaybe(Maybe_1.Just(f(v)))];
                        }
                        return [2 /*return*/, helpers.liftMaybe(Maybe_1.Nothing)];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.filter = function (pred) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, helpers.liftMaybe(value.filter(pred))];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = Maybe_1.Just;
                        return [4 /*yield*/, this.runPromise(helpers)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_c.sent()])];
                    case 2:
                        _b = _c.sent();
                        return [2 /*return*/, Maybe_1.Nothing];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaybeAsyncImpl.prototype.map = function (f) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return _this.runPromise(helpers).then(f); });
    };
    MaybeAsyncImpl.prototype.chain = function (f) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runPromise(helpers)];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, helpers.fromPromise(f(value))];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.toEitherAsync = function (error) {
        var _this = this;
        return EitherAsync_1.EitherAsync(function (_a) {
            var liftEither = _a.liftEither;
            return __awaiter(_this, void 0, void 0, function () {
                var maybe;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.run()];
                        case 1:
                            maybe = _b.sent();
                            return [2 /*return*/, liftEither(maybe.toEither(error))];
                    }
                });
            });
        });
    };
    MaybeAsyncImpl.prototype.ifJust = function (effect) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var maybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        maybe = _a.sent();
                        maybe.ifJust(effect);
                        return [2 /*return*/, helpers.liftMaybe(maybe)];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype.ifNothing = function (effect) {
        var _this = this;
        return exports.MaybeAsync(function (helpers) { return __awaiter(_this, void 0, void 0, function () {
            var maybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run()];
                    case 1:
                        maybe = _a.sent();
                        maybe.ifNothing(effect);
                        return [2 /*return*/, helpers.liftMaybe(maybe)];
                }
            });
        }); });
    };
    MaybeAsyncImpl.prototype['fantasy-land/map'] = function (f) {
        return this.map(f);
    };
    MaybeAsyncImpl.prototype['fantasy-land/chain'] = function (f) {
        return this.chain(f);
    };
    MaybeAsyncImpl.prototype.then = function (onfulfilled, onrejected) {
        return this.run().then(onfulfilled, onrejected);
    };
    return MaybeAsyncImpl;
}());
exports.MaybeAsync = Object.assign(function (runPromise) { return new MaybeAsyncImpl(runPromise); }, {
    catMaybes: function (list) { return __awaiter(void 0, void 0, void 0, function () {
        var values;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(list)];
                case 1:
                    values = _a.sent();
                    return [2 /*return*/, Maybe_1.Maybe.catMaybes(values)];
            }
        });
    }); },
    fromPromise: function (f) {
        return exports.MaybeAsync(function (_a) {
            var fP = _a.fromPromise;
            return fP(f());
        });
    },
    liftPromise: function (f) { return exports.MaybeAsync(f); },
    liftMaybe: function (maybe) {
        return exports.MaybeAsync(function (_a) {
            var liftMaybe = _a.liftMaybe;
            return liftMaybe(maybe);
        });
    }
});
MaybeAsyncImpl.prototype.constructor = exports.MaybeAsync;
