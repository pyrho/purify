"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
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
exports.parseError = exports.intersect = exports.date = exports.tuple = exports.nonEmptyList = exports.maybe = exports.lazy = exports.exactly = exports.record = exports.array = exports.oneOf = exports.enumeration = exports.unknown = exports.boolean = exports.nullable = exports.optional = exports.nullType = exports.number = exports.string = exports.Codec = void 0;
var Either_1 = require("./Either");
var Function_1 = require("./Function");
var Maybe_1 = require("./Maybe");
var NonEmptyList_1 = require("./NonEmptyList");
var isEmptySchema = function (schema) {
    return Object.keys(schema).length === 0;
};
var isObject = function (obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};
var reportError = function (type, input) {
    var receivedString = '';
    switch (typeof input) {
        case 'undefined':
            receivedString = 'undefined';
            break;
        case 'object':
            receivedString =
                input === null
                    ? 'null'
                    : Array.isArray(input)
                        ? 'an array with value ' + JSON.stringify(input)
                        : 'an object with value ' + JSON.stringify(input);
            break;
        case 'boolean':
            receivedString = 'a boolean';
            break;
        case 'symbol':
            receivedString = 'a symbol';
            break;
        case 'function':
            receivedString = 'a function';
            break;
        case 'bigint':
            receivedString = "a bigint with value " + input.toString();
    }
    receivedString =
        receivedString || "a " + typeof input + " with value " + JSON.stringify(input);
    return "Expected " + type + ", but received " + receivedString;
};
var removeOneOfWithSingleElement = function (schema) {
    var _a;
    var schemaKeys = Object.keys(schema);
    if (schemaKeys.length === 1 &&
        ((_a = schema.oneOf) === null || _a === void 0 ? void 0 : _a.length) === 1 &&
        typeof schema.oneOf[0] === 'object') {
        Object.assign(schema, schema.oneOf[0]);
        delete schema.oneOf;
    }
    return schema;
};
var flattenNestedOneOf = function (schema) {
    var _a;
    if (Array.isArray(schema.oneOf)) {
        for (var i = 0; i < schema.oneOf.length; i++) {
            var e = schema.oneOf[i];
            if (typeof e === 'object' && e.oneOf) {
                schema.oneOf.splice(i, 1);
                (_a = schema.oneOf).push.apply(_a, __spread(e.oneOf));
                return optimizeSchema(schema);
            }
        }
    }
    return schema;
};
var optimizeSchema = function (schema) {
    flattenNestedOneOf(schema);
    removeOneOfWithSingleElement(schema);
    return schema;
};
exports.Codec = {
    /** Creates a codec for any JSON object */
    interface: function (properties) {
        var keys = Object.keys(properties);
        var decode = function (input) {
            var e_1, _a;
            if (!isObject(input)) {
                return Either_1.Left(reportError('an object', input));
            }
            var result = {};
            try {
                for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                    var key = keys_1_1.value;
                    if (!input.hasOwnProperty(key) &&
                        !properties[key]._isOptional) {
                        return Either_1.Left("Problem with property \"" + key + "\": it does not exist in received object " + JSON.stringify(input));
                    }
                    var decodedProperty = properties[key].decode(input[key]);
                    if (decodedProperty.isLeft()) {
                        return Either_1.Left("Problem with the value of property \"" + key + "\": " + decodedProperty.extract());
                    }
                    var value = decodedProperty.extract();
                    if (value !== undefined) {
                        result[key] = value;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Either_1.Right(result);
        };
        var encode = function (input) {
            var e_2, _a;
            var result = {};
            try {
                for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                    var key = keys_2_1.value;
                    result[key] = properties[key].encode(input[key]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        };
        return {
            decode: decode,
            encode: encode,
            unsafeDecode: function (input) { return decode(input).unsafeCoerce(); },
            schema: function () {
                return keys.reduce(function (acc, key) {
                    var isOptional = properties[key]._isOptional;
                    if (!isOptional) {
                        acc.required.push(key);
                    }
                    acc.properties[key] = optimizeSchema(properties[key].schema());
                    return acc;
                }, {
                    type: 'object',
                    properties: {},
                    required: []
                });
            }
        };
    },
    /** Creates a codec for any type, you can add your own deserialization/validation logic in the decode argument */
    custom: function (_a) {
        var decode = _a.decode, encode = _a.encode, schema = _a.schema;
        return {
            decode: decode,
            encode: encode,
            unsafeDecode: function (input) { return decode(input).unsafeCoerce(); },
            schema: schema !== null && schema !== void 0 ? schema : (function () { return ({}); })
        };
    }
};
/** A codec for any string value. Most of the time you will use it to implement an interface codec (see the Codec#interface example above). Encoding a string acts like the identity function */
exports.string = exports.Codec.custom({
    decode: function (input) {
        return typeof input === 'string'
            ? Either_1.Right(input)
            : Either_1.Left(reportError('a string', input));
    },
    encode: Function_1.identity,
    schema: function () { return ({ type: 'string' }); }
});
/** A codec for any number value. This includes anything that has a typeof number - NaN, Infinity etc. Encoding a number acts like the identity function */
exports.number = exports.Codec.custom({
    decode: function (input) {
        return typeof input === 'number'
            ? Either_1.Right(input)
            : Either_1.Left(reportError('a number', input));
    },
    encode: Function_1.identity,
    schema: function () { return ({ type: 'number' }); }
});
/** A codec for null only */
exports.nullType = exports.Codec.custom({
    decode: function (input) {
        return input === null ? Either_1.Right(input) : Either_1.Left(reportError('a null', input));
    },
    encode: Function_1.identity,
    schema: function () { return ({ type: 'null' }); }
});
var undefinedType = exports.Codec.custom({
    decode: function (input) {
        return input === undefined
            ? Either_1.Right(input)
            : Either_1.Left(reportError('an undefined', input));
    },
    encode: Function_1.identity
});
exports.optional = function (codec) {
    return (__assign(__assign({}, exports.oneOf([codec, undefinedType])), { schema: codec.schema, _isOptional: true }));
};
/** A codec for a value T or null. Keep in mind if you use `nullable` inside `Codec.interface` the property will still be required */
exports.nullable = function (codec) {
    return exports.oneOf([codec, exports.nullType]);
};
/** A codec for a boolean value */
exports.boolean = exports.Codec.custom({
    decode: function (input) {
        return typeof input === 'boolean'
            ? Either_1.Right(input)
            : Either_1.Left(reportError('a boolean', input));
    },
    encode: Function_1.identity,
    schema: function () { return ({ type: 'boolean' }); }
});
/** A codec that can never fail, but of course you get no type information. Encoding an unknown acts like the identity function */
exports.unknown = exports.Codec.custom({
    decode: Either_1.Right,
    encode: Function_1.identity,
    schema: function () { return ({}); }
});
/** A codec for a TypeScript enum */
exports.enumeration = function (e) {
    var enumValues = Object.values(e);
    return exports.Codec.custom({
        decode: function (input) {
            return exports.oneOf([exports.string, exports.number])
                .decode(input)
                .chain(function (x) {
                var enumIndex = enumValues.indexOf(x);
                return enumIndex !== -1
                    ? Either_1.Right(enumValues[enumIndex])
                    : Either_1.Left(reportError('an enum member', input));
            });
        },
        encode: Function_1.identity,
        schema: function () { return ({ enum: enumValues }); }
    });
};
/** A codec combinator that receives a list of codecs and runs them one after another during decode and resolves to whichever returns Right or to Left if all fail */
exports.oneOf = function (codecs) {
    return exports.Codec.custom({
        decode: function (input) {
            var e_3, _a;
            var errors = [];
            try {
                for (var codecs_1 = __values(codecs), codecs_1_1 = codecs_1.next(); !codecs_1_1.done; codecs_1_1 = codecs_1.next()) {
                    var codec = codecs_1_1.value;
                    var res = codec.decode(input);
                    if (res.isRight()) {
                        return res;
                    }
                    else {
                        errors.push(res.extract());
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (codecs_1_1 && !codecs_1_1.done && (_a = codecs_1.return)) _a.call(codecs_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return Either_1.Left("One of the following problems occured: " + errors
                .map(function (err, i) { return "(" + i + ") " + err; })
                .join(', '));
        },
        encode: function (input) {
            var e_4, _a;
            var _loop_1 = function (codec) {
                var res = Either_1.Either.encase(function () { return codec.encode(input); })
                    .mapLeft(function (_) { return ''; })
                    .chain(codec.decode);
                if (res.isRight()) {
                    return { value: codec.encode(input) };
                }
            };
            try {
                for (var codecs_2 = __values(codecs), codecs_2_1 = codecs_2.next(); !codecs_2_1.done; codecs_2_1 = codecs_2.next()) {
                    var codec = codecs_2_1.value;
                    var state_1 = _loop_1(codec);
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (codecs_2_1 && !codecs_2_1.done && (_a = codecs_2.return)) _a.call(codecs_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return input;
        },
        schema: function () { return ({ oneOf: codecs.map(function (x) { return x.schema(); }) }); }
    });
};
/** A codec for an array */
exports.array = function (codec) {
    return exports.Codec.custom({
        decode: function (input) {
            if (!Array.isArray(input)) {
                return Either_1.Left(reportError('an array', input));
            }
            else {
                var result = [];
                for (var i = 0; i < input.length; i++) {
                    var decoded = codec.decode(input[i]);
                    if (decoded.isRight()) {
                        result.push(decoded.extract());
                    }
                    else {
                        return Either_1.Left("Problem with the value at index " + i + ": " + decoded.extract());
                    }
                }
                return Either_1.Right(result);
            }
        },
        encode: function (input) { return input.map(codec.encode); },
        schema: function () { return ({
            type: 'array',
            items: [codec.schema()]
        }); }
    });
};
var numberString = exports.Codec.custom({
    decode: function (input) {
        return exports.string
            .decode(input)
            .chain(function (x) {
            return isFinite(+x) ? Either_1.Right(x) : Either_1.Left(reportError('a number', input));
        });
    },
    encode: Function_1.identity,
    schema: exports.number.schema
});
/** A codec for an object without specific properties, its restrictions are equivalent to the Record<K, V> type so you can only check for number and string keys */
exports.record = function (keyCodec, valueCodec) {
    return exports.Codec.custom({
        decode: function (input) {
            var e_5, _a;
            var result = {};
            var keyCodecOverride = keyCodec === exports.number ? numberString : keyCodec;
            if (!isObject(input)) {
                return Either_1.Left(reportError('an object', input));
            }
            try {
                for (var _b = __values(Object.keys(input)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    if (input.hasOwnProperty(key)) {
                        var decodedKey = keyCodecOverride.decode(key);
                        var decodedValue = valueCodec.decode(input[key]);
                        if (decodedKey.isRight() && decodedValue.isRight()) {
                            result[decodedKey.extract()] = decodedValue.extract();
                        }
                        else if (decodedKey.isLeft()) {
                            return Either_1.Left("Problem with key type of property \"" + key + "\": " + decodedKey.extract());
                        }
                        else if (decodedValue.isLeft()) {
                            return Either_1.Left("Problem with the value of property \"" + key + "\": " + decodedValue.extract());
                        }
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return Either_1.Right(result);
        },
        encode: function (input) {
            var result = {};
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    result[keyCodec.encode(key)] = valueCodec.encode(input[key]);
                }
            }
            return result;
        },
        schema: function () { return ({
            type: 'object',
            additionalProperties: valueCodec.schema()
        }); }
    });
};
/** A codec that only succeeds decoding when the value is exactly what you've constructed the codec with */
exports.exactly = function (expectedValue) {
    return exports.Codec.custom({
        decode: function (input) {
            return input === expectedValue
                ? Either_1.Right(expectedValue)
                : Either_1.Left(typeof input === typeof expectedValue
                    ? "Expected a " + typeof input + " with a value of exactly " + JSON.stringify(expectedValue) + ", the types match, but the received value is " + JSON.stringify(input)
                    : reportError("a " + typeof expectedValue + " with a value of exactly " + expectedValue, input));
        },
        encode: Function_1.identity,
        schema: function () { return ({ type: typeof expectedValue, enum: [expectedValue] }); }
    });
};
/** A special codec used when dealing with recursive data structures, it allows a codec to be recursively defined by itself */
exports.lazy = function (getCodec) {
    return exports.Codec.custom({
        decode: function (input) { return getCodec().decode(input); },
        encode: function (input) { return getCodec().encode(input); },
        schema: function () { return ({
            $comment: 'Lazy codecs are not supported when generating a JSON schema'
        }); }
    });
};
/** A codec for purify's Maybe type. Encode runs Maybe#toJSON, which effectively returns the value inside if it's a Just or undefined if it's Nothing */
exports.maybe = function (codec) {
    var baseCodec = exports.Codec.custom({
        decode: function (input) {
            return Maybe_1.Maybe.fromNullable(input).caseOf({
                Just: function (x) { return codec.decode(x).map(Maybe_1.Just); },
                Nothing: function () { return Either_1.Right(Maybe_1.Nothing); }
            });
        },
        encode: function (input) { return input.toJSON(); },
        schema: function () { return ({
            oneOf: isEmptySchema(codec.schema())
                ? []
                : [codec.schema(), { type: 'null' }]
        }); }
    });
    return __assign(__assign({}, baseCodec), { _isOptional: true });
};
/** A codec for purify's NEL type */
exports.nonEmptyList = function (codec) {
    var arrayCodec = exports.array(codec);
    return exports.Codec.custom({
        decode: function (input) {
            return arrayCodec
                .decode(input)
                .chain(function (x) {
                return NonEmptyList_1.NonEmptyList.fromArray(x).toEither("Expected an array with one or more elements, but received an empty array");
            });
        },
        encode: arrayCodec.encode,
        schema: function () { return (__assign(__assign({}, arrayCodec.schema()), { minItems: 1 })); }
    });
};
/** The same as the array decoder, but accepts a fixed amount of array elements and you can specify each element type, much like the tuple type */
exports.tuple = function (codecs) {
    return exports.Codec.custom({
        decode: function (input) {
            if (!Array.isArray(input)) {
                return Either_1.Left(reportError('an array', input));
            }
            else if (codecs.length !== input.length) {
                return Either_1.Left("Expected an array of length " + codecs.length + ", but received an array with length of " + input.length);
            }
            else {
                var result = [];
                for (var i = 0; i < codecs.length; i++) {
                    var decoded = codecs[i].decode(input[i]);
                    if (decoded.isRight()) {
                        result.push(decoded.extract());
                    }
                    else {
                        return Either_1.Left("Problem with the value at index " + i + ": " + decoded.extract());
                    }
                }
                return Either_1.Right(result);
            }
        },
        encode: function (input) { return input.map(function (x, i) { return codecs[i].encode(x); }); },
        schema: function () { return ({
            type: 'array',
            items: codecs.map(function (x) { return x.schema(); }),
            additionalItems: false,
            minItems: codecs.length,
            maxItems: codecs.length
        }); }
    });
};
/** A codec for a parsable date string, on successful decoding it resolves to a Date object. The validity of the date string during decoding is decided by the browser implementation of Date.parse. Encode runs toISOString on the passed in date object */
exports.date = exports.Codec.custom({
    decode: function (input) {
        return exports.string
            .decode(input)
            .mapLeft(function (err) { return "Problem with date string: " + err; })
            .chain(function (x) {
            return Number.isNaN(Date.parse(x))
                ? Either_1.Left('Expected a valid date string, but received a string that cannot be parsed')
                : Either_1.Right(new Date(x));
        });
    },
    encode: function (input) { return input.toISOString(); },
    schema: function () { return ({ type: 'string', format: 'date-time' }); }
});
/** Creates an intersection between two codecs. If the provided codecs are not for an object, the second decode result will be returned */
exports.intersect = function (t, u) {
    return exports.Codec.custom({
        decode: function (input) {
            var et = t.decode(input);
            if (et.isLeft()) {
                return et;
            }
            var eu = u.decode(input);
            if (eu.isLeft()) {
                return eu;
            }
            var valuet = et.extract();
            var valueu = eu.extract();
            return isObject(valuet) && isObject(valueu)
                ? Either_1.Right(Object.assign(valuet, valueu))
                : Either_1.Right(valueu);
        },
        encode: function (x) {
            var valuet = t.encode(x);
            var valueu = u.encode(x);
            return isObject(valuet) && isObject(valueu)
                ? Object.assign(valuet, valueu)
                : valueu;
        },
        schema: function () { return ({ allOf: [t, u].map(function (x) { return x.schema(); }) }); }
    });
};
var oneofRegex = /^(One of the following problems occured:)\s/;
var oneOfCounterRegex = /\(\d\)\s/;
var oneOfSeparatorRegex = /\, (?=\()/g;
var failureRegex = /^(Expected ).+(, but received )/;
var failureReceivedSeparator = ' with value';
var missingPropertyMarker = 'Problem with property "';
var badPropertyMarker = 'Problem with the value of property "';
var badPropertyKeyMarker = 'Problem with key type of property "';
var dateFailureMarket = 'Problem with date string: ';
var indexMarker = 'Problem with the value at index ';
var expectedTypesMap = {
    'an object': 'object',
    'a number': 'number',
    'a string': 'string',
    'an undefined': 'undefined',
    'a boolean': 'boolean',
    'an array': 'array',
    'a null': 'null',
    'an enum member': 'enum'
};
var receivedTypesMap = {
    'a string': 'string',
    'a number': 'number',
    null: 'null',
    undefined: 'undefined',
    'a boolean': 'boolean',
    'an array': 'array',
    'an object': 'object',
    'a symbol': 'symbol',
    'a function': 'function',
    'a bigint': 'bigint'
};
var receivedTypesWithoutValue = [
    'null',
    'undefined',
    'boolean',
    'symbol',
    'function',
    'bigint'
];
/** Turns a string error message produced by a built-in purify codec into a meta object */
exports.parseError = function (error) {
    var oneOfCheck = error.match(oneofRegex);
    // One of the following problems occured: (0) *, (1) *
    if (oneOfCheck) {
        var remainer = error.replace(oneOfCheck[0], '');
        return {
            type: 'oneOf',
            errors: remainer
                .split(oneOfSeparatorRegex)
                .map(function (x) { return exports.parseError(x.replace(x.match(oneOfCounterRegex)[0], '')); })
        };
    }
    var failureCheck = error.match(failureRegex);
    // Expected an object, but received an array with value []
    if (failureCheck) {
        var receivedTypeRaw = error.split(failureCheck[2]).pop();
        var receivedType = receivedTypesMap[receivedTypeRaw.split(failureReceivedSeparator)[0]];
        if (receivedType) {
            var expectedTypeRaw = error
                .replace(failureCheck[1], '')
                .split(failureCheck[2])[0];
            return {
                type: 'failure',
                expectedType: expectedTypesMap[expectedTypeRaw],
                receivedType: receivedType,
                receivedValue: receivedTypesWithoutValue.includes(receivedType)
                    ? undefined
                    : JSON.parse(receivedTypeRaw.split(failureReceivedSeparator).pop())
            };
        }
    }
    // Problem with property "a": it does not exist in received object {}
    if (error.startsWith(missingPropertyMarker)) {
        var property = error.replace(missingPropertyMarker, '').split('": ')[0];
        return {
            type: 'property',
            property: property,
            error: {
                type: 'failure',
                receivedType: 'undefined'
            }
        };
    }
    // Problem with the value of property "a": *
    // Problem with key type of property "a": *
    if (error.startsWith(badPropertyMarker) ||
        error.startsWith(badPropertyKeyMarker)) {
        var _a = __read(error
            .replace(badPropertyMarker, '')
            .replace(badPropertyKeyMarker, '')
            .split(/": (.+)/)), property = _a[0], restOfError = _a.slice(1);
        return {
            type: 'property',
            property: property,
            error: exports.parseError(restOfError.join(''))
        };
    }
    // Problem with date string: *
    if (error.startsWith(dateFailureMarket)) {
        return exports.parseError(error.replace(dateFailureMarket, ''));
    }
    //  Problem with the value at index 0: *
    if (error.startsWith(indexMarker)) {
        var _b = __read(error
            .replace(indexMarker, '')
            .split(/: (.+)/)), index = _b[0], restOfError = _b.slice(1);
        return {
            type: 'index',
            index: Number(index),
            error: exports.parseError(restOfError.join(''))
        };
    }
    return { type: 'custom', message: error };
};
