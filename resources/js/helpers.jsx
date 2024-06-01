import { format,toZonedTime } from 'date-fns-tz';
import { isToday, isYesterday } from 'date-fns';

export const formatMessageDateLong = (date) => {
    // UTC+7 time zone
    const timeZone = 'Asia/Bangkok';
    const now = toZonedTime(new Date(), timeZone);
    const inputDate = toZonedTime(new Date(date), timeZone);

    if (isToday(inputDate)) {
        return format(inputDate, 'HH:mm', { timeZone });
    } else if (isYesterday(inputDate)) {
        return `Hôm qua ${format(inputDate, 'HH:mm', { timeZone })}`;
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return format(inputDate, 'dd/MM', { timeZone });
    } else {
        return format(inputDate, 'dd/MM/yyyy', { timeZone });
    }
};

export const formatMessageDateShort = (date) => {
    // UTC+7 time zone
    const timeZone = 'Asia/Bangkok';
    const now = toZonedTime(new Date(), timeZone);
    const inputDate = toZonedTime(new Date(date), timeZone);

    if (isToday(inputDate)) {
        return format(inputDate, 'HH:mm', { timeZone });
    } else if (isYesterday(inputDate)) {
        return 'Hôm qua';
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return format(inputDate, 'dd/MM', { timeZone });
    } else {
        return format(inputDate, 'dd/MM/yyyy', { timeZone });
    }
}
