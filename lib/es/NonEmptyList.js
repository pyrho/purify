"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonEmptyList = void 0;
const Maybe_1 = require("./Maybe");
const NonEmptyListConstructor = (list) => list;
exports.NonEmptyList = Object.assign(NonEmptyListConstructor, {
    fromArray: (source) => exports.NonEmptyList.isNonEmpty(source) ? Maybe_1.Just(source) : Maybe_1.Nothing,
    unsafeCoerce: (source) => {
        if (exports.NonEmptyList.isNonEmpty(source)) {
            return source;
        }
        throw new Error('NonEmptyList#unsafeCoerce was ran on an empty array');
    },
    fromTuple: (source) => exports.NonEmptyList(source.toArray()),
    head: (list) => list[0],
    last: (list) => list[list.length - 1],
    isNonEmpty: (list) => list.length > 0,
    tail: (list) => list.slice(1)
});
