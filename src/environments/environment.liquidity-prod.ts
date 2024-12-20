/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-11 14:58:13
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-31 17:32:07
 * @Description:
 */
export const http = window.location.protocol;
export const ip = window.location.hostname;

// export const port = "8082";
// export const localUrl = `http://${ip}:${port}`;
// // export const localUrl = ``;
// if (window.location.port === '8082') {

// }
export const environment = {
  production: true,
  localUrl: '',
  clientName: 'admin',
  password: 'Kissen123'
};
