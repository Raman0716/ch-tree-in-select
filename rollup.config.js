import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import vuePlugin from 'rollup-plugin-vue'
import less from 'rollup-plugin-less'
import typescript from 'rollup-plugin-typescript2'
const resolveFile = name => path.resolve(__dirname, name)
const extensions = ['.js', '.ts', '.tsx', '.vue']

// ts
const tsPlugin = typescript({
  tsconfig: resolveFile('./tsconfig.json'), // 本地ts配置
  extensions
})

export default {
  input: [
    'src/vue-tree-in-select/index.js'
  ],
  output: {
    dir: 'dist/vue-tree-in-select/',
    name: 'vue-tree-in-select',
    exports: 'named',
    format: 'umd' // cjs amd 可用
  },
  plugins: [
    tsPlugin,
    resolve(extensions),
    commonjs(),
    uglify(), // 压缩代码
    vuePlugin({
      exposeFilename: false,
      target: 'browser'
    }),
    less({
      output: 'dist/vue-tree-in-select/index.css'
    }), // less编译
    babel({
      exclude: 'node_modules/**', // 只编译源代码
      extensions,
      runtimeHelpers: true,
      presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
      ],
      plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ["@babel/plugin-transform-runtime"]
      ]
    })
  ]
}
