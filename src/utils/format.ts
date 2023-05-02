import { default as dayjs } from 'dayjs';

export const formatDate = (date: number | string) => dayjs(date).format('MMMM D, YYYY h:mm A');

export const formatNumber = (number: number | string) => {
  if (typeof number === 'string') {
    number = Number(number);
  }

  return number.toLocaleString();
}

export const formatTime = (hour: number | string, minute: number | string) => {
  if (typeof hour === 'string') {
    hour = Number(hour);
  }

  if (typeof minute === 'string') {
    minute = Number(minute);
  }

  return dayjs().hour(hour).minute(minute).format('H:mm');
}