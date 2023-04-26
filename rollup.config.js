import resolve from 'rollup-plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import clear from 'rollup-plugin-clear'
import terser from '@rollup/plugin-terser'

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/es/index.js',
            format: 'es',
        },
        {
            file: 'dist/es/index.min.js',
            format: 'es',
            plugins: [terser()],
        },
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'XYAliOSS',
            globals: {
                'ali-oss': 'OSS',
            },
        },
        {
            file: 'dist/index.min.js',
            format: 'umd',
            name: 'XYAliOSS',
            globals: {
                'ali-oss': 'OSS',
            },
            plugins: [terser()],
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
