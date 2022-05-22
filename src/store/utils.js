import _ from "lodash";
import { CURRENCY, ORDERS } from "store/config.js";

/**
 * Deep-copy an object.
 * @param {Object} obj 
 * @returns {Object}
 */
const cloneObject = (obj) => {
    return _.cloneDeep(obj);
}

/**
 * Private helper.
 * Get date as ISO string with timezone offset.
 * @returns {String} 
 */
const dateNow = () => {
    let dt = new Date();
    const tzDiffHours = dt.getTimezoneOffset() / 60;
    dt.setHours(dt.getHours() - tzDiffHours);
    return dt.toISOString();
}

/**
 * Get current time in HH:MM format
 * @returns {String}
 */
const currentTimeString = () => {
    const dt = dateNow();
    const [ hh, mm, ss ] = dt.split("T")[1].split("\.")[0].split(":");
    return [ hh, mm ].join(":");
}

const sortFoodsByCategory = (foods) => {
    const foodsOrder = ORDERS.sortOrder.foods;

    foods.sort((fd1, fd2) => {
        const fd1_category = foodsOrder.includes(fd1.category) ? fd1.category : "other";
        const fd2_category = foodsOrder.includes(fd2.category) ? fd2.category : "other";
        if (fd1_category === fd2_category && fd1_category === "other") {
            if (fd1.category < fd2.category) return -1;
            else if (fd1.category > fd2.category) return 1;
            else return 0;
        }
        return foodsOrder.indexOf(fd1_category) - foodsOrder.indexOf(fd2_category);
    })
    return foods;
}

const todayAsString = () => {
    const dt = dateNow();
    return dt.split("T")[0];
}

const tomorrowAsString = () => {
    let dt = new Date(dateNow());
    dt.setDate(dt.getDate() + 1);
    return dt.toISOString().split("T")[0];
}

const toCurrency = (num) => {
    return `${CURRENCY.sign}${(+num).toFixed(2)}`;
}

/**
 * Convert a date to a menu-printable format,
 * e.g April 1st or September 24th
 * @param {String} dt - format YYYY-MM-DD
 * @returns {String}
 */
const toPrintableDate = (dt) => {
    const [weekday, month, day] = (new Date(Date.parse(dt))).toLocaleString(
        "default", 
        { weekday: "long", month: "long", day: "numeric" }
    ).split(" ");
    return `${month} ${toOrdinal(+day)}`;
}

/**
 * Convert number to ordinal where number is a day of the month,
 * thus 1 <= n <= 31
 * @param {Number} n - Day of month
 * @returns {String}
 */
const toOrdinal = (n) => {
    n = Number(n);
    const suffixes = { 1: "st", 2: "nd", 3: "rd" };
    let suffix = "th";
    if (n <= 3 || n >=21)  suffix = suffixes[n % 10] ?? "th";
    return `${n}${suffix}`;
}

export {
    cloneObject,
    currentTimeString,
    sortFoodsByCategory,
    todayAsString,
    tomorrowAsString,
    toCurrency,
    toPrintableDate,
    toOrdinal
}
