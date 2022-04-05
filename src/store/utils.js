import _ from 'lodash';

/**
 * Deep-copy an object.
 * @param {Object} obj 
 * @returns {Object}
 */
const cloneObject = (obj) => {
    return _.cloneDeep(obj);
}

/**
 * Convert number to ordinal where number is a day of the month,
 * thus 1 <= n <= 31
 * @param {Number} n - Day of month
 * @returns {String}
 */
 function toOrdinal(n) {
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    let suffix = "th";
    if (n <= 3 || n >=21)  suffix = suffixes[n % 10] ?? "th";
    return `${n}${suffix}`;
}

export {
    cloneObject,
    toOrdinal
}
