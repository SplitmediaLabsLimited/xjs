//Rollup plugins
import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';
import { minify } from 'uglify-es';

export default {
  input: 'src/index.ts',
  name: 'xjs',
  output: {
    file: 'dist/build/xjs-script.min.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    typescript(),
    commonjs({
      ignoreGlobal: false,
      sourceMap: false,
      ignore: ['conditional-runtime-dependency']
    }),
    babel({
      plugins: ['external-helpers'],
      externalHelpers: true,
      exclude: 'node_modules/**'
    }),
    license({
      banner: {
        file: ('./LICENSE')
      }
    }),
    uglify({
      output: {
        comments: function(node, comment) {
            var text = comment.value;
            var type = comment.type;
            if (type == "comment2") {
                // multiline comment
                return /@preserve|@license|@cc_on/i.test(text);
            }
        }
      },
      ie8: false
    },
    minify
  ),
    filesize(),
  ],
}