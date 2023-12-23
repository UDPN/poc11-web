import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot } from '@angular/router';

import { LockScreenFlag } from '@store/common-store/lock-screen-store.service';
import CryptoJS from 'crypto-js';
import { endOfDay, startOfDay } from 'date-fns';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { silentEvent } from 'ng-zorro-antd/core/util';
import { v4 as uuidv4 } from 'uuid';

const fnGetRandomNum = function getRandomNum(m: number, n: number): number {
  let num = Math.floor(Math.random() * (m - n) + n);
  return num;
};

const fnGetFile = function getFile(url: string, isBlob = false): Promise<NzSafeAny> {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest();
    client.responseType = isBlob ? 'blob' : '';
    client.onreadystatechange = () => {
      if (client.readyState !== 4) {
        return;
      }
      if (client.status === 200) {
        const urlArr = client.responseURL.split('/');
        resolve({
          data: client.response,
          url: urlArr[urlArr.length - 1]
        });
      } else {
        reject(new Error(client.statusText));
      }
    };
    client.open('GET', url);
    client.send();
  });
};

const fnCheckForm = function checkForm(form: FormGroup): boolean {
  let arr: any = [];
  Object.keys(form.controls).forEach(key => {
    form.controls[key].markAsDirty();
    form.controls[key].updateValueAndValidity();
    if (document.querySelector(`.${key}`) !== null && form.controls[key].invalid) {
      arr.push(key);
    }
  });
  if (arr.length > 0) {
    document.querySelector(`.${arr[0]}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  return !form.invalid;
};


const fnClearFormArray = function clearFormArray(formArray: FormArray): void {
  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }
};

const fnStopMouseEvent = function stopMouseEvent(e: MouseEvent): void {
  silentEvent(e);


};


const fnRemoveDouble = function removeDouble<T>(list: NzSafeAny[], col: NzSafeAny): T {
  const obj = {};
  return list.reduce((cur, next) => {
    // @ts-ignore
    obj[next[col]] ? '' : (obj[next[col]] = true && cur.push(next));
    return cur;
  }, []);
};


const getDeepReuseStrategyKeyFn = function (route: ActivatedRouteSnapshot): string {
  let temp = route;
  while (temp.firstChild) {
    temp = temp.firstChild;
  }
  return fnGetReuseStrategyKeyFn(temp);
};


const fnGetReuseStrategyKeyFn = function getKey(route: ActivatedRouteSnapshot): string {
  const configKey = route.data['key'];
  if (!configKey) {
    return '';
  }

  if (Object.keys(route.queryParams).length > 0) {
    return configKey + JSON.stringify(route.queryParams);
  } else if (Object.keys(route.params).length > 0) {

    return configKey + JSON.stringify(route.params);
  } else {

    return `${configKey}{}`;
  }
};


const fnGetPathWithoutParam = function getPathWithoutParam(path: string): string {
  const paramIndex = path.indexOf('?');
  if (paramIndex > -1) {
    return path.substring(0, paramIndex);
  }
  return path;
};


const fnGetUUID = function getUUID(): string {
  return uuidv4();
};

const fnGetBase64 = function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};


const fnEncrypt = function encrypt(word: NzSafeAny, keyStr: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(word), keyStr).toString();
};

const fnEncrypts = function encrypt(word: NzSafeAny, keyStr: string, iv: any): string {
  if (!word) {
    return '';
  }
  const encrypted: any = CryptoJS.AES.encrypt(JSON.stringify(word), CryptoJS.enc.Utf8.parse(keyStr), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

const fnDecrypt = function decrypt(word: NzSafeAny, keyStr: string): LockScreenFlag {
  const bytes = CryptoJS.AES.decrypt(word, keyStr);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

/*import {endOfDay, startOfDay} from 'date-fns';*/
const fnStartOfDay = function StartOfDay(time: number): number {
  return startOfDay(time).getTime();
};

const fnEndOfDay = function EndOfDay(time: number): number {
  return endOfDay(time).getTime();
};



const fnFormatToHump = function formatToHump(value: string): string {
  return value.replace(/\-(\w)/g, (_, letter) => letter.toUpperCase());
};


const fnRandomString = function randomString(len: number, radix: string | number) {
  var chars = '0123456789'.split('');
  var uuid = [],
    radix = radix || chars.length;
  var i = 0;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * (radix as number)];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');

}

const JSONLength = function JSONLength(obj: object) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


const strToBase64 = function strToBase64(str: string) {
  let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    res = '',
    binaryStr = '';
  for (let i = 0, max = str.length; i < max; i++) {
    let temp = str.charCodeAt(i).toString(2);
    binaryStr += new Array(9 - temp.length).join('0') + temp;
  }
  let tail = binaryStr.length % 6,
    left = binaryStr.substr(0, binaryStr.length - tail),
    right = binaryStr.substr(binaryStr.length - tail, binaryStr.length);
  for (let i = 0, max = left.length; i < max; i += 6) {
    let temp = left.substr(i, 6);
    let index = parseInt(temp, 2);
    res += code[index];
  }
  if (tail) {
    right = right + new Array(7 - right.length).join('0');
    res += code[parseInt(right, 2)];
    res += new Array((6 - tail) / 2 + 1).join('=');
  }
  return res;
}


const timestampToTime = function timestampToTime(str: string) {

  let timeZone = new Date().getTimezoneOffset() / -60;

  const time = new Date(Number(str) * 1000);
  const len = time.getTime();
  const offset = time.getTimezoneOffset() * 60000;
  const utcTime = len + offset;


  const date = new Date(utcTime + 3600000 * timeZone);
  const y = date.getFullYear(),
    mon = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();

  function addZero(value: number) {
    if (value < 10) return "0" + value;
    else return value;
  }
  const result = y + "-" + addZero(mon) + "-" + addZero(d) + " " + addZero(h) + ":" + addZero(m) + ":" + addZero(s);
  return result

}

const timestampToMonth = function timestampToMonth(str: string) {

  let timeZone = new Date().getTimezoneOffset() / -60;

  const time = new Date(Number(str) * 1000);
  const len = time.getTime();
  const offset = time.getTimezoneOffset() * 60000;
  const utcTime = len + offset;


  const date = new Date(utcTime + 3600000 * timeZone);
  const y = date.getFullYear(),
    mon = date.getMonth() + 1

  function addZero(value: number) {
    if (value < 10) return "0" + value;
    else return value;
  }
  const result = y + "-" + addZero(mon);
  return result

}

const timestampToDate = function timestampToTime(str: string) {

  let timeZone = new Date().getTimezoneOffset() / -60;

  const time = new Date(Number(str) * 1000);
  const len = time.getTime();
  const offset = time.getTimezoneOffset() * 60000;
  const utcTime = len + offset;


  const date = new Date(utcTime + 3600000 * timeZone);
  const y = date.getFullYear(),
    mon = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();

  function addZero(value: number) {
    if (value < 10) return "0" + value;
    else return value;
  }
  const result = y + "-" + addZero(mon) + "-" + addZero(d);
  return result

}


const timeToTimestamp = function timeToTimestamp(str: any) {
  let date = new Date(str);
  return date.valueOf() / 1000;
}


const timeZone = function timeZone(t: any) {
  return new Date().getTimezoneOffset() / -60;
}


const timeZoneTotime = function timeZoneTotime(t: any) {
  if (!t) t = 8;

  const time = new Date();
  const len = time.getTime();
  const offset = time.getTimezoneOffset() * 60000;
  const utcTime = len + offset;


  const date = new Date(utcTime + 3600000 * t);
  const y = date.getFullYear(),
    mon = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();

  function addZero(value: number) {
    if (value < 10) return "0" + value;
    else return value;
  }
  const result = y + "-" + addZero(mon) + "-" + addZero(d) + " " + addZero(h) + ":" + addZero(m) + ":" + addZero(s);
  return result

}

const objPushKv = function objPushKv(t: any, k: string) {
  let arry = t;
  let arryNew: any[] = []
  arry.map((item: any, index: any) => {
    arryNew.push(Object.assign({}, item, { [k]: index + 1 }));
  });
  return arryNew;
}

const thousandthMark = function thousandthMark(x: any) {
  // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export {
  fnFormatToHump,
  fnGetReuseStrategyKeyFn,
  fnDecrypt,
  fnEncrypt,
  fnEncrypts,
  fnGetBase64,
  fnGetPathWithoutParam,
  fnGetFile,
  fnClearFormArray,
  fnCheckForm,
  fnStopMouseEvent,
  getDeepReuseStrategyKeyFn,
  fnRemoveDouble,
  fnGetRandomNum,
  fnStartOfDay,
  fnEndOfDay,
  fnGetUUID,
  fnRandomString,
  JSONLength,
  strToBase64,
  timeToTimestamp,
  timeZoneTotime,
  timeZone,
  timestampToTime,
  timestampToDate,
  timestampToMonth,
  objPushKv,
  thousandthMark
};
