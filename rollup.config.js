import resolve from 'rollup-plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import terser from '@rollup/plugin-terser'

const name = 'XYAliOSS'
const isProd = process.env.NODE_ENV === 'production'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/es/index.js',
            format: 'es',
            sourcemap: !isProd,
        },
        {
            file: 'dist/es/index.min.js',
            format: 'es',
            plugins: [terser()],
            sourcemap: !isProd,
        },
        {
            file: 'dist/index.js',
            format: 'umd',
            name,
            globals: { 'ali-oss': 'OSS' },
            sourcemap: !isProd,
        },
        {
            file: 'dist/index.min.js',
            format: 'umd',
            name,
            globals: { 'ali-oss': 'OSS' },
            plugins: [terser()],
            sourcemap: !isProd,
        },
    ],
    plugins: [
        resolve(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        clear({
            targets: ['dist'],
            watch: true,
        }),
    ],
    external: ['ali-oss'],
    watch: {
        include: 'src/**',
    },
}
