import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript(),
    resolve({
      mainFields: ['lodash-es']
    })
  ],
  output: {
    file: 'dist/xjs.umd.js',
    name: 'xjs',
    format: 'umd',
  },
};
