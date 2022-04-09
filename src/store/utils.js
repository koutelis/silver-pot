import _ from 'lodash';

/**
 * Deep-copy an object.
 * @param {Object} obj 
 * @returns {Object}
 */
const cloneObject = (obj) => {
    return _.cloneDeep(obj);
}

const todayAsString = () => {
    let dt = new Date();
    const tzDiffHours = dt.getTimezoneOffset() / 60;
    dt.setHours(dt.getHours() - tzDiffHours);
    return dt.toISOString().split("T")[0];
}

const tomorrowAsString = () => {
    let dt = new Date();
    const tzDiffHours = dt.getTimezoneOffset() / 60;
    dt.setHours(dt.getHours() - tzDiffHours);
    dt.setDate(dt.getDate() + 1);
    return dt.toISOString().split("T")[0];
}

/**
 * Convert a date to a menu-printable format,
 * e.g April 1st or September 24th
 * @param {String} dt - format YYYY-MM-DD
 * @returns {String}
 */
const toPrintableDate = (dt) => {
    const [weekday, month, day] = (new Date(Date.parse(dt))).toLocaleString(
        'default', 
        { weekday: 'long', month: 'long', day: 'numeric' }
    ).split(" ");
    return `${month} ${toOrdinal(+day)}`;
}

/**
 * Convert number to ordinal where number is a day of the month,
 * thus 1 <= n <= 31
 * @param {Number} n - Day of month
 * @returns {String}
 */
function toOrdinal(n) {
    n = Number(n);
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    let suffix = "th";
    if (n <= 3 || n >=21)  suffix = suffixes[n % 10] ?? "th";
    return `${n}${suffix}`;
}

export {
    cloneObject,
    todayAsString,
    tomorrowAsString,
    toPrintableDate,
    toOrdinal
}
