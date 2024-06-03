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

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type || attachment.mine;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "image";
};

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type || attachment.mine;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "video";
};

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type || attachment.mine;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "audio";
};

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type || attachment.mine;
    return mime  === "application/pdf";
};

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
};

export const formatBytes = (bytes, decimals = 2) => {
    if(bytes === 0 ) return "0 Bytes"

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    let i = 0;
    let size = bytes;
    while(size >= k) {
        size /= k;
        i++;
    }

    return parseFloat(size.toFixed(dm)) + " " + sizes[i]
};
