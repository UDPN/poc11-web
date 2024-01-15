/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-15 13:27:39
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-15 13:27:52
 * @Description: 
 */
import 'zone.js';

import * as process from 'process';
import { Buffer } from 'buffer';

window.process = process;
(window as any).global = window;
global.Buffer = global.Buffer || Buffer;
