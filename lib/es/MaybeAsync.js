"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaybeAsync = void 0;
const Maybe_1 = require("./Maybe");
const EitherAsync_1 = require("./EitherAsync");
const helpers = {
    liftMaybe(maybe) {
        if (maybe.isJust()) {
            return Promise.resolve(maybe.extract());
        }
        throw Maybe_1.Nothing;
    },
    fromPromise(promise) {
        return promise.then(helpers.liftMaybe);
    }
};
class MaybeAsyncImpl {
    constructor(runPromise) {
        this.runPromise = runPromise;
        this[Symbol.toStringTag] = 'MaybeAsync';
        this['fantasy-land/ap'] = this.ap;
        this['fantasy-land/alt'] = this.alt;
        this['fantasy-land/extend'] = this.extend;
        this['fantasy-land/filter'] = this.filter;
    }
    async orDefault(defaultValue) {
        const maybe = await this.run();
        return maybe.orDefault(defaultValue);
    }
    join() {
        return exports.MaybeAsync(async (helpers) => {
            const maybe = await this.run();
            if (maybe.isJust()) {
                const nestedMaybe = await maybe.extract();
                return helpers.liftMaybe(nestedMaybe);
            }
            return helpers.liftMaybe(Maybe_1.Nothing);
        });
    }
    ap(maybeF) {
        return exports.MaybeAsync(async (helpers) => {
            const value = await this.run();
            const maybe = await maybeF;
            return helpers.liftMaybe(value.ap(maybe));
        });
    }
    alt(other) {
        return exports.MaybeAsync(async (helpers) => {
            const value = await this.run();
            const maybe = await other;
            return helpers.liftMaybe(value.alt(maybe));
        });
    }
    extend(f) {
        return exports.MaybeAsync(async (helpers) => {
            const maybe = await this.run();
            if (maybe.isJust()) {
                const v = exports.MaybeAsync.liftMaybe(maybe);
                return helpers.liftMaybe(Maybe_1.Just(f(v)));
            }
            return helpers.liftMaybe(Maybe_1.Nothing);
        });
    }
    filter(pred) {
        return exports.MaybeAsync(async (helpers) => {
            const value = await this.run();
            return helpers.liftMaybe(value.filter(pred));
        });
    }
    async run() {
        try {
            return Maybe_1.Just(await this.runPromise(helpers));
        }
        catch (_a) {
            return Maybe_1.Nothing;
        }
    }
    map(f) {
        return exports.MaybeAsync((helpers) => this.runPromise(helpers).then(f));
    }
    chain(f) {
        return exports.MaybeAsync(async (helpers) => {
            const value = await this.runPromise(helpers);
            return helpers.fromPromise(f(value));
        });
    }
    toEitherAsync(error) {
        return EitherAsync_1.EitherAsync(async ({ liftEither }) => {
            const maybe = await this.run();
            return liftEither(maybe.toEither(error));
        });
    }
    ifJust(effect) {
        return exports.MaybeAsync(async (helpers) => {
            const maybe = await this.run();
            maybe.ifJust(effect);
            return helpers.liftMaybe(maybe);
        });
    }
    ifNothing(effect) {
        return exports.MaybeAsync(async (helpers) => {
            const maybe = await this.run();
            maybe.ifNothing(effect);
            return helpers.liftMaybe(maybe);
        });
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    then(onfulfilled, onrejected) {
        return this.run().then(onfulfilled, onrejected);
    }
}
exports.MaybeAsync = Object.assign((runPromise) => new MaybeAsyncImpl(runPromise), {
    catMaybes: async (list) => {
        const values = await Promise.all(list);
        return Maybe_1.Maybe.catMaybes(values);
    },
    fromPromise: (f) => exports.MaybeAsync(({ fromPromise: fP }) => fP(f())),
    liftPromise: (f) => exports.MaybeAsync(f),
    liftMaybe: (maybe) => exports.MaybeAsync(({ liftMaybe }) => liftMaybe(maybe))
});
MaybeAsyncImpl.prototype.constructor = exports.MaybeAsync;
