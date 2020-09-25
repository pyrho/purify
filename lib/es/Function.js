"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderToNumber = exports.compare = exports.Order = exports.always = exports.identity = void 0;
/** The identity function, returns the value it was given */
exports.identity = (x) => x;
/** Returns a function that always returns the same value. Also known as `const` in other languages */
exports.always = (x) => () => x;
var Order;
(function (Order) {
    Order["LT"] = "LT";
    Order["EQ"] = "EQ";
    Order["GT"] = "GT";
})(Order = exports.Order || (exports.Order = {}));
/** Compares two values using the default "<" and ">" operators */
exports.compare = (x, y) => {
    if (x > y) {
        return Order.GT;
    }
    else if (x < y) {
        return Order.LT;
    }
    else {
        return Order.EQ;
    }
};
/** Maps the Order enum to the values expected by the standard ECMAScript library when doing comparison (Array.prototype.sort, for example) */
exports.orderToNumber = (order) => {
    switch (order) {
        case Order.LT:
            return -1;
        case Order.EQ:
            return 0;
        case Order.GT:
            return 1;
    }
};
