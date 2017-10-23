import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';
import { minify } from 'uglify-es';

const defaultConfig = {
  input: 'src/index.ts',
  name: 'xjs',
  plugins: [nodeResolve({
    jsnext: true,
    main: true
  }),
  typescript(),
  license({
    banner: {
      file: ('./LICENSE')
    }
  }),
  filesize()]
}

let activeConfigs = [{
  name: 'xjs-iife',
  output: {
    format: 'iife',
    file: 'dist/build/xjs-iife.js'
  }
}, {
  name: 'xjs-umd',
  output: {
    format: 'umd',
    file: 'dist/build/xjs-umd.js'
  }
}]

if (process.env.IIFE) {
  activeConfigs = [{
    name: 'xjs-iife',
    output: {
      format: 'iife',
      file: 'dist/xjs.js'
    }
  }]
} else if (process.env.UMD) {
  activeConfigs = [{
    name: 'xjs-umd',
    output: {
      format: 'umd',
      file: 'dist/xjs.js'
    }
  }]
}

activeConfigs.forEach(activeConfig => {
  Object.assign(activeConfig, defaultConfig)
})

const minifiedConfigs = activeConfigs.reduce(
  (minifiedConfigs, activeConfig) => minifiedConfigs.concat(
    Object.assign({}, activeConfig, {
      plugins: [
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
        ...activeConfig.plugins
      ],
      output:  process.env.ALL ? {
        file: activeConfig.output.file.replace('.js', '.min.js'),
        format: activeConfig.output.format
      } : {
        file: activeConfig.output.file,
        format: activeConfig.output.format
      }
    })
  ),
  []
)

export default activeConfigs.concat(minifiedConfigs)