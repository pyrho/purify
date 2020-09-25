"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EitherAsync = void 0;
const Either_1 = require("./Either");
const MaybeAsync_1 = require("./MaybeAsync");
const helpers = {
    liftEither(either) {
        if (either.isRight()) {
            return Promise.resolve(either.extract());
        }
        throw either.extract();
    },
    fromPromise(promise) {
        return promise.then(helpers.liftEither);
    },
    throwE(error) {
        throw error;
    }
};
class EitherAsyncImpl {
    constructor(runPromise) {
        this.runPromise = runPromise;
        this[Symbol.toStringTag] = 'EitherAsync';
        this['fantasy-land/ap'] = this.ap;
        this['fantasy-land/alt'] = this.alt;
        this['fantasy-land/extend'] = this.extend;
    }
    async leftOrDefault(defaultValue) {
        const either = await this.run();
        return either.leftOrDefault(defaultValue);
    }
    async orDefault(defaultValue) {
        const either = await this.run();
        return either.orDefault(defaultValue);
    }
    join() {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            if (either.isRight()) {
                const nestedEither = await either.extract();
                return helpers.liftEither(nestedEither);
            }
            return helpers.liftEither(either);
        });
    }
    ap(other) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            const o = await other;
            return helpers.liftEither(either.ap(o));
        });
    }
    alt(other) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            const o = await other;
            return helpers.liftEither(either.alt(o));
        });
    }
    extend(f) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            if (either.isRight()) {
                const v = exports.EitherAsync.liftEither(either);
                return helpers.liftEither(Either_1.Right(f(v)));
            }
            return helpers.liftEither(either);
        });
    }
    async run() {
        try {
            return Either_1.Right(await this.runPromise(helpers));
        }
        catch (e) {
            return Either_1.Left(e);
        }
    }
    bimap(f, g) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            return helpers.liftEither(either.bimap(f, g));
        });
    }
    map(f) {
        return exports.EitherAsync((helpers) => this.runPromise(helpers).then(f));
    }
    mapLeft(f) {
        return exports.EitherAsync(async (helpers) => {
            try {
                return await this.runPromise(helpers);
            }
            catch (e) {
                throw f(e);
            }
        });
    }
    chain(f) {
        return exports.EitherAsync(async (helpers) => {
            const value = await this.runPromise(helpers);
            return helpers.fromPromise(f(value));
        });
    }
    chainLeft(f) {
        return exports.EitherAsync(async (helpers) => {
            try {
                return await this.runPromise(helpers);
            }
            catch (e) {
                return helpers.fromPromise(f(e));
            }
        });
    }
    toMaybeAsync() {
        return MaybeAsync_1.MaybeAsync(async ({ liftMaybe }) => {
            const either = await this.run();
            return liftMaybe(either.toMaybe());
        });
    }
    swap() {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            if (either.isRight())
                helpers.throwE(either.extract());
            return helpers.liftEither(Either_1.Right(either.extract()));
        });
    }
    ifLeft(effect) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            either.ifLeft(effect);
            return helpers.liftEither(either);
        });
    }
    ifRight(effect) {
        return exports.EitherAsync(async (helpers) => {
            const either = await this.run();
            either.ifRight(effect);
            return helpers.liftEither(either);
        });
    }
    'fantasy-land/map'(f) {
        return this.map(f);
    }
    'fantasy-land/bimap'(f, g) {
        return this.bimap(f, g);
    }
    'fantasy-land/chain'(f) {
        return this.chain(f);
    }
    then(onfulfilled, onrejected) {
        return this.run().then(onfulfilled, onrejected);
    }
}
exports.EitherAsync = Object.assign((runPromise) => new EitherAsyncImpl(runPromise), {
    fromPromise: (f) => exports.EitherAsync(({ fromPromise: fP }) => fP(f())),
    liftPromise: (f) => exports.EitherAsync(f),
    liftEither: (either) => exports.EitherAsync(({ liftEither }) => liftEither(either)),
    lefts: (list) => Promise.all(list.map((x) => x.run())).then(Either_1.Either.lefts),
    rights: (list) => Promise.all(list.map((x) => x.run())).then(Either_1.Either.rights),
    sequence: (eas) => exports.EitherAsync(async (helpers) => {
        let res = [];
        for await (const e of eas) {
            if (e.isLeft()) {
                return helpers.liftEither(e);
            }
            res.push(e.extract());
        }
        return helpers.liftEither(Either_1.Right(res));
    })
});
EitherAsyncImpl.prototype.constructor = exports.EitherAsync;
