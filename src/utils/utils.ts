export const baseUrl = 'https://mapi.acebook.cc';

export const fetcher = (url = '') => fetch(baseUrl + url).then((res) => res.json());

export async function request(url = '', data = {}, init = {}) {
  // Default options are marked with *
  const response = await fetch(baseUrl + url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    ...init
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export const millisecond2Minute = (n: number | any) => {
  if (typeof n === 'number') {
    const t = n / 1000;

    let s = Math.floor(t % 60).toString();
    if (!s[1]) s = `0${s}`;

    let m = Math.floor(t / 60).toString();
    if (!m[1]) m = `0${m}`;

    return m + ':' + s;
  }

};

export const second2Minute = (n: number | any) => {
  if (typeof n === 'number') {

    let s = Math.floor(n % 60).toString();
    if (!s[1]) s = `0${s}`;

    let m = Math.floor(n / 60).toString();
    if (!m[1]) m = `0${m}`;

    return m + ':' + s;
  }

};


export function formatTime(value: number | string): string {
  if (value) {
    const date = new Date(value);	// 时间戳为毫秒：13位数

    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    // let minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // let second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${year}-${month}-${day}`;
  } else {
    return '';
  }
}


export const formatNumToTenThousand = (n: any) => {
  if (typeof n !== 'number') return 0;
  if (n >= 100000)
    return `${Math.floor((n / 100000) * 10) / 10}万`;
  return n;
};


const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export const getIsMobile = (key: string) => ['xs', 'sm'].includes(key);

export function isSafari(){
  try {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
      ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
      ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1;
  }catch (e) {
    console.log(e)

  }

}