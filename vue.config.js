const path = require("path");

module.exports = {
    publicPath: "./",
    lintOnSave: false,
    runtimeCompiler: true,

    devServer: {
        host: process.env.HOST !== undefined ? process.env.HOST : "localhost",
        port: process.env.PORT !== undefined ? process.env.PORT : 8083
    },

    pluginOptions: {
        // "style-resources-loader": {
        //     preProcessor: "scss",
        //     patterns: [path.resolve(__dirname, "./src/assets/scss/style.scss")]
        // }
    },
    configureWebpack: {
        resolve: {
            alias: {
                "bootstrap-components": path.resolve(__dirname, "node_modules/bootstrap-vue/es/components"),
                "@": path.resolve(__dirname, "src")
            }
        }
    }
};
