/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-11 14:58:13
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-26 16:52:36
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
  clientName: 'admintest',
  password: 'Kissen123'
};
