const path = require('path');

module.exports = {
    mode: 'development',
    entry: './index.ts',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        ],
    },
    devServer: {
        static: './dist',
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                secure: false,
                changeOrigin: true,
            },
        },
        liveReload: true,
        host: 'localhost',
        port: 8000,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};