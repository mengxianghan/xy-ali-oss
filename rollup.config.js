import resolve from 'rollup-plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import {terser} from 'rollup-plugin-terser'

export default {
    input: 'src/Aliyun.js',
    output: [
        {
            file: 'dist/Aliyun.js',
            format: 'esm'
        },
        {
            file: 'dist/Aliyun.umd.js',
            format: 'umd',
            name: 'Aliyun',
            globals: {
                'ali-oss': 'OSS'
            }
        },
        {
            file: 'dist/Aliyun.umd.min.js',
            format: 'umd',
            name: 'Aliyun',
            globals: {
                'ali-oss': 'OSS'
            },
            plugins: [
                terser()
            ]
        }
    ],
    plugins: [
        resolve(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        clear({
            targets: ['dist'],
            watch: true
        })
    ],
    external: ['ali-oss']
}
