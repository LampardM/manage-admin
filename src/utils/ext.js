/*
 * @Description: In User Settings Edit
 * @Author: jieq
 * @Date: 2020-04-15 22:39:59
 * @LastEditors: jieq
 * @LastEditTime: 2020-04-15 22:46:28
 */

/*is判断类*/
let UtilExtIs = {
    //判断对象是否是数组
    isArray: function (object) {
        return Array.isArray(object)
    },
    //判断对象是否是对象
    isObject: function (object) {
        return Object.prototype.toString.call(object) === '[object Object]'
    },
    //判断对象是否是方法
    isFunc: function (object) {
        return typeof object == 'function'
    },
    //判断对象是否是Boolean
    isBoolean: function (object) {
        return typeof object == 'boolean'
    },
    //判断对象是否是Date对象
    isDate: function (object) {
        return object instanceof Date
    },
    //判断对象是否是数字
    isNumber: function (object) {
        return typeof object == 'number'
    },
    //判断对象是否是字符串
    isString: function (object) {
        return typeof object == 'string'
    },
    //判断对象是否是数字
    isNumberArray: function (object) {
        return UtilExtIs.isArray(object) && UtilExtIs.isNumber(object[0])
    },
    //判断对象是否是字符串
    isStringArray: function (object) {
        return UtilExtIs.isArray(object) && UtilExtIs.isString(object[0])
    },
    //判断对象是否是字符串
    isDateArray: function (object) {
        return UtilExtIs.isArray(object) && UtilExtIs.isDate(object[0])
    },
    //判断对象/数组/字符串是否无值
    isEmpty: function (object) {
        return !_.isHasValue(object)
    },
    //判断对象/数组/字符串是否有值
    isHasValue: function (object) {
        if (object) {
            if (_.isArray(object)) {
                return object.length > 0;
            } else if (_.isObject(object)) {
                return Object.keys(object).length > 0;
            } else {
                return !!object;
            }
        } else {
            if (_.isNumber(object)) {
                return true
            }
            return false;
        }
    },
    //判断是否为JSON字符串
    isJSONString: function (str) {
        if (typeof str == 'string') {
            try {
                let obj = JSON.parse(str);
                return !!(typeof obj == 'object' && obj);
            } catch (e) {
                return false;
            }
        }
    }
};

/*数组or对象混合处理类
 * @callback iteratee 回调函数
 * @param {Object} current
 * @param {string} keyindex
 * @param {Object} original
 */
let UtilExtObject = {
    //对象克隆
    clone: function (object) {
        return { ...object }
    },

    //方法用于调用数组的每个元素，并将元素传递给回调函数
    each: function (object, iteratee) {
        if (_.isHasValue(object) && iteratee) {
            if (_.isArray(object)) {
                for (let i = 0; i < object.length; i++) {
                    if (iteratee(object[i], i, object) === false) {
                        break;
                    }
                }
            } else {
                // eslint-disable-next-line no-unused-vars
                for (let key in object) {
                    if (iteratee(object[key], key, object) === false) {
                        break;
                    }
                }
            }
        }
    },

    //查找符合条件的第一条数据
    find: function (object, iteratee) {
        let result = null;
        _.each(object, (current, keyindex, original) => {
            if (iteratee(current, keyindex, original)) {
                result = current;
                return false;
            } else {
                return true;
            }
        });
        return result;
    },

    //查找符合条件的所有数据
    filter: function (object, iteratee) {
        let isArray = _.isArray(object);
        let result = isArray ? [] : {};
        _.each(object, (current, keyindex, original) => {
            if (iteratee(current, keyindex, original)) {
                if (isArray) {
                    result.push(current);
                } else {
                    result[keyindex] = current;
                }
            }
        });
        return result;
    },

    //方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
    map: function (object, iteratee) {
        let isArray = _.isArray(object);
        let result = isArray ? [] : {};
        _.each(object, (current, keyindex, original) => {
            if (isArray) {
                result.push(iteratee(current, keyindex, original));
            } else {
                result[keyindex] = iteratee(current, keyindex, original);
            }
        });
        return result;
    }
}

// 数组处理类
let UtilExtArray = {
    /**
     * @desc 根据数组每项中的值作为key转为JSON
     * @param {Array} [array] 原始数组
     * @returns {Object} 转换后的对象
     * @example
     * [{id:1,name:'name1'},{id:2,name:'name2'}].arrayToJson('id') => {1:{id:1,name:'name1'},2:{id:2,name:'name2'}}
     */
    arrayToJson: function (array = [], key) {
        var result = {},
            obj = null;
        if (array.length > 0) {
            for (let i = 0; i < array.length; i++) {
                obj = array[i][key];
                (typeof obj != "undefined") && (result[obj] = array[i]);
            }
        }
        return result;
    },

    //数组去重
    uniq: function (array = []) {
        let result = [];
        // eslint-disable-next-line no-unused-vars
        for (let i of array) {
            if (result.indexOf(i) === -1) {
                result.push(i);
            }
        }
        return result;
    },

    //数组取合集(顺序以第一个数组为准)
    union: function (...array) {
        let result = [];
        // eslint-disable-next-line no-unused-vars
        for (let i of array) {
            result.push(...i);
        }
        return _.uniq(result);
    },

    //数组取交集(顺序以第一个数组为准)
    intersection: function (...array) {
        let result = [];
        let min = array.sort((a, b) => {
            return a.length - b.length;
        })[0];
        // eslint-disable-next-line no-unused-vars
        for (let i of min) {
            let isUse = true;
            // eslint-disable-next-line no-unused-vars
            for (let arr of array) {
                if (arr.indexOf(i) === -1) {
                    isUse = false;
                    break;
                }
            }
            isUse && result.push(i);
        }
        result.sort((a, b) => {
            return array[0].indexOf(a) - array[0].indexOf(b);
        });
        return result;
    }
};

// 字符串处理类
let UtilExtString = {
    /**
     * @desc 将 Date/String 转化为指定格式的String
     * @summary
     * 季度(q)、月(M) 、日(d) 、周(E=二,EE=周二,EEE=星期二)、时(h=12小时,H=24小时) 、分(m) 、秒(s) 、毫秒(S)
     * tips:可以用 1 - 2 个占位符 * 年(y)可以用 1 - 4 个占位符，毫秒(S)只能用 1 个占位符(是 1 - 3 位的数字)
     * @param {(String|Date)} object 需要格式化的对象
     * @param {((Array|Object)|String)} ...args 格式化规则
     * @returns {string} 格式化后的时间字符串
     * @example
     * Date:
     * 1. UtilExtString.format(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * 2. UtilExtString.format(new Date(), "yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * 3. UtilExtString.format(new Date(), "yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     * 4. UtilExtString.format(new Date()) ==> 2006-7-2 08:10  默认格式： "yyyy-M-d HH:mm"
     * String:
     * 1. UtilExtString.format("{0} hello {1}", "hulk","world") => "hulk hello world"
     * 2. UtilExtString.format("{name} hello {value}", {name: "hulk",value: "world"}) => "hulk hello world"
     */
    format: function (object, ...args) {
        //分别处理string和Date两种场景
        const handleStringJoin = (object, args) => {
            if (args.length === 1 && typeof (args[0]) == "object") {
                // eslint-disable-next-line no-unused-vars
                for (let key in args[0]) {
                    object = object.replace(new RegExp("({" + key + "})", "g"), args[0][key] || "");
                }
            } else {
                for (let i = 0; i < args.length; i++) {
                    object = object.replace(new RegExp("({[" + i + "]})", "g"), args[i] || "");
                }
            }
            return object;
        }

        const handleDateFormat = (object, args) => {
            let fmtstr = args[0] || "yyyy-MM-dd";
            let week = {
                "0": '\u65e5',
                "1": '\u4e00',
                "2": '\u4e8c',
                "3": '\u4e09',
                "4": '\u56db',
                "5": '\u4e94',
                "6": '\u516d'
            };
            let o = {
                "M+": object.getMonth() + 1, //月份
                "d+": object.getDate(), //日
                "h+": object.getHours() % 12 === 0 ? 12 : object.getHours() % 12, //小时
                "H+": object.getHours(), //小时
                "m+": object.getMinutes(), //分
                "s+": object.getSeconds(), //秒
                "q+": Math.floor((object.getMonth() + 3) / 3), //季度
                "S": object.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmtstr)) {
                fmtstr = fmtstr.replace(RegExp.$1, (object.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmtstr)) {
                fmtstr = fmtstr.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : "") + week[object.getDay() + ""]);
            }
            // eslint-disable-next-line no-unused-vars
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmtstr)) {
                    fmtstr = fmtstr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmtstr;
        }
        if (object instanceof Date) {
            return handleDateFormat(object, args)
        } else if (args.length > 0) {
            try {
                const dateLike = new Date(_.isString(object) ? (Number.isNaN(+object) ? this.parseDate(object) : +object) : object)
                return handleDateFormat(dateLike, args)
            } catch (e) {
                console.error(`error on format: ${object} - ${e}`);
                return handleStringJoin(object, args)
            }

        } else {
            return object;
        }
    },

    //字符串转日期对象
    parseDate: function (str) {
        return new Date(str.replace(/-/g, "/"))
    },

    //字符串转化为JSON
    parseJson: function (str) {
        // eslint-disable-next-line no-eval
        return str ? eval("(" + str + ")") : {}
    },

    //经纬度String类型格式化为Number类型
    parseLatLng: function (str) {
        return !isNaN(str) ? parseFloat(str) : 0;
    },

    // 手机号码加*
    parseMobile: function (tel) {
        if (tel) {
            tel += ''
            return tel.substr(0, 3) + '****' + tel.substr(-4)
        } else {
            return ''
        }
    },

    // 获取字符串长度(汉字算两个字符,字母数字算一个)
    parseByteLen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var a = str.charAt(i);
            // eslint-disable-next-line no-control-regex
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 1;
            } else {
                len += .5;
            }
        }
        return len;
    },
};

let UtilExtDate = {
    /**
     * @desc  Date时间增加操作
     * @param {Date} [dateTime] 原始时间
     * @param {Object} json 需要添加的数量，可为负数
     * @param {int} json.month 月
     * @param {int} json.day 日
     * @param {int} json.hour 时
     * @param {int} json.minute 分
     * @param {int} json.second 秒
     * @returns {Date} 操作后的时间
     */
    timeAdd: function (dateTime, { month, day, hour, minute, second }) {
        let newDT = new Date(dateTime);
        month && newDT.setMonth(dateTime.getMonth() + month);
        day && newDT.setDate(dateTime.getDate() + day);
        hour && newDT.setHours(dateTime.getHours() + hour);
        minute && newDT.setMinutes(dateTime.getMinutes() + minute);
        second && newDT.setSeconds(dateTime.getSeconds() + second);
        return newDT;
    },
    /**
     * @desc 分钟向下取整
     * @param {Date} [dateTime] 原始时间
     * @param {int} [minute=10] 取整的分钟数
     * @returns {Date} 操作后的时间
     */
    timeFloor: function (dateTime, minute = 10) {
        let newDT = new Date(dateTime);
        newDT.setMinutes(Math.floor(dateTime.getMinutes() / minute) * minute);
        return newDT;
    },
    /**
     * @desc 分钟向上取整
     * @param {Date} [dateTime] 原始时间
     * @param {int} [minute=10] 取整的分钟数
     * @returns {Date} 操作后的时间
     */
    timeCeil: function (dateTime, minute = 10) {
        dateTime.setMinutes(Math.ceil(dateTime.getMinutes() / minute) * minute);
        return dateTime;
    },
};

let UtilExtFunction = {
    /**
     * @desc 节流函数（{delay}毫秒内任意次调用都只执行第一次）
     * @param {int} [delay] 节流毫秒数
     * @param {function} [action] 执行方法
     * @returns {function} 节流后的方法
     */
    throttle: function (delay, action) {
        let last = 0;
        return function () {
            let curr = +new Date()
            if (curr - last > delay) {
                action.apply(this, arguments)
                last = curr
            }
        }
    },

    /**
     * @desc 防抖函数（{delay}毫秒内任意次调用都只执行最后一次）
     * @param {int} [delay] 毫秒数
     * @param {function} [action] 执行方法
     * @returns {function} 防抖函数
     */
    debounce: function (delay, action) {
        let last;
        return function () {
            let ctx = this,
                args = arguments;
            clearTimeout(last);
            last = setTimeout(function () {
                action.apply(ctx, args)
            }, delay);
        }
    },

}

let _ = {
    ...UtilExtIs,
    ...UtilExtDate,
    ...UtilExtArray,
    ...UtilExtString,
    ...UtilExtObject,
    ...UtilExtFunction
};

export default _;