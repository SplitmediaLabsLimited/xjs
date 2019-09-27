import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript(),
    resolve({
      mainFields: ['lodash-es'],
    }),
    commonjs(),
    terser(),
  ],
  output: {
    file: 'dist/xjs.umd.js',
    name: 'Xjs',
    format: 'umd',
  },
};
