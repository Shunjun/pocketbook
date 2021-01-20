/**
 * 转换时间格式
 * @param fmt yyyy-MM-dd hh:mm:ss
 * @param date
 */
export function dateFormat(fmt: string, date: Date): string {
  let ret: RegExpExecArray | null;
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
}

/**
 * 将20020101格式的数字转化为字符串
 *
 * @export
 * @param {number} dateNumber
 * @return {string}  {string}
 */
export function DateNumber2DateString(dateNumber: number): string {
  let dateString = String(dateNumber);
  let year = dateString.slice(0, 4);
  let month = dateString.slice(4, 6);
  let date = dateString.slice(6, 8);
  if (dateString.length < 8) {
    return `${year}-${month}`;
  }
  return `${year}-${month}-${date}`;
}

export function DateNumber2Date(dateNumber: number) {
  let string = String(dateNumber);
  if (!(string.length === 6 || string.length === 8)) {
    return new Date();
  }

  let dateString = DateNumber2DateString(dateNumber);

  if (dateString.length < 10) {
    dateString = [dateString, '-01'].join('');
  }

  return new Date(dateString);
}

export type DateType = string | number | Date;

/**
 * 获取日期对象
 *
 * @export
 * @param {DateType} date
 * @return {*}  {Date}
 */
export function getDateObj(date: DateType): Date {
  return date instanceof Date ? date : new Date(date);
}

/**
 * 是否是同一个月
 *
 * @export
 * @param {DateType} month1
 * @param {DateType} month2
 * @return {*}
 */
export function isSameMonth(month1: DateType, month2: DateType) {
  const month1Date = getDateObj(month1);
  const month2Date = getDateObj(month2);

  if (month1Date.getFullYear() === month2Date.getFullYear()) {
    if (month1Date.getMonth() === month2Date.getMonth()) {
      return true;
    }
  }

  return false;
}

/**
 * 比较两个日期
 * date1在date2之前,返回true
 * @export
 * @param {DateType} date1
 * @param {DateType} date2
 * @return {boolean}
 */
export function isDate1BeforeDate2(date1: DateType, date2: DateType): boolean {
  const Date1 = getDateObj(date1);
  const Date2 = getDateObj(date2);

  return !!(Date1.getTime() - Date2.getTime() < 0);
}

/**
 * 获取下个月1号的日期对象
 * @param date
 */
export function nextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/**
 * 获取从开始到结束的每个月的列表
 * @param start
 * @param end
 */
export function getMonthList(start: DateType, end: DateType) {
  let startDate = getDateObj(start);
  let endDate = getDateObj(end);

  if (!isDate1BeforeDate2(startDate, endDate)) {
    const tempDate = endDate;
    endDate = startDate;
    startDate = tempDate;
  }

  const result: string[] = [];

  let temp = startDate;
  result.push(dateFormat('yyyy-MM', temp));

  while (!isSameMonth(temp, endDate)) {
    temp = nextMonth(temp);
    result.push(dateFormat('yyyy-MM', temp));
  }

  return result;
}

/**
 * 是不是一个月的第一天
 *
 * @export
 * @param {DateType} date
 * @return {*}
 */
export function isFirstDayOfMonth(date: DateType) {
  date = getDateObj(date);
  return date.getDate() === 1;
}

/**
 * 是不是一个的最后一天
 *
 * @export
 * @param {DateType} date
 * @return {*}
 */
export function isLastDayOfMonth(date: DateType) {
  date = getDateObj(date);
  const nextMonthFirstDate = nextMonth(date);
  const lastDayOfMonth = new Date(nextMonthFirstDate.getTime() - 24 * 60 * 60 * 1000);
  const lastDay = lastDayOfMonth.getDate();

  return date.getDate() === lastDay;
}

/**
 * 获取之前N个月的日期
 *
 * @export
 * @param {DateType} date
 * @param {number} number
 * @param {string} type 'year' | 'M'
 * @return {*}  {Date}
 */
export function subtractDate(date: DateType, number: number, type: string): Date {
  const startDate = getDateObj(date);

  let year = startDate.getFullYear();
  let month = startDate.getMonth() + 1;
  let day = startDate.getDate();

  if (type.toLowerCase() === 'month' || type === 'M') {
    month = month - number;
    if (month < 0) {
      const MOD = Math.abs(month) % 12;
      const subtractYear = Math.floor(Math.abs(month) / 12) + 1;
      year = year - subtractYear;
      month = 12 - MOD;
    }
  }

  return new Date(year, month, day);
}

export function getMonthDateList(date) {
  const dateObj = getDateObj(date);
  let dateList: string[] = [];

  let year = dateObj.getFullYear();
  let month = dateObj.getMonth();
  let day = 1;

  while (isSameMonth(new Date(year, month, day), dateObj)) {
    dateList.push(dateFormat('yyyy-MM-dd', new Date(year, month, day)));
    day++;
  }

  return dateList;
}
