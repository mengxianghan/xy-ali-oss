import resolve from 'rollup-plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import {terser} from 'rollup-plugin-terser'

export default {
    input: 'src/Alioss.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm'
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'Alioss',
            globals: {
                'ali-oss': 'OSS'
            }
        },
        {
            file: 'dist/index.umd.min.js',
            format: 'umd',
            name: 'Alioss',
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
