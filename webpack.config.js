/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-31 12:12:12
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-31 12:13:02
 * @Description: 
 */
const webpack = require('webpack');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

function getClientEnvironment() {
    // Grab NX_* environment variables and prepare them to be injected
    // into the application via DefinePlugin in webpack configuration.
    const NX_APP = /^NX_/i;

    const raw = Object.keys(process.env)
        .filter((key) => NX_APP.test(key))
        .reduce((env, key) => {
            env[key] = process.env[key];
            return env;
        }, {});

    // Stringify all values so we can feed into webpack DefinePlugin
    return {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };
}

module.exports = (config, options, context) => {
    // Overwrite the mode set by Angular if the NODE_ENV is set
    config.mode = process.env.NODE_ENV || config.mode;
    config.plugins.push(new webpack.DefinePlugin(getClientEnvironment()));
    config.plugins.push(new ModuleFederationPlugin({
        name: 'poc11-web',
        filename: 'remoteEntry.js',
        remotes: {
            remote: "remote@http://localhost:3001/remoteEntry.js", // React 应用的地址
            dashboard: "dashboard@http://localhost:4201/remoteEntry.js", // React 应用的地址
        },
        shared: {
            react: { 
              singleton: true,
              requiredVersion: false,
              eager: true
            },
            "react-dom": { 
              singleton: true,
              requiredVersion: false,
              eager: true
            },
            "antd": { 
              singleton: true,
              requiredVersion: false
            }
        }
    }));
    return config;
};
