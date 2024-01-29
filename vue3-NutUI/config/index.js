import { defineConfig{{#if typescript }}, type UserConfigExport{{/if}} } from '@tarojs/cli'
{{#if typescript }}import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'{{/if}}
import devConfig from './dev'
import prodConfig from './prod'
import NutUIResolver from '@nutui/auto-import-resolver'
{{#unless (eq compiler "Vite") }}import Components from 'unplugin-vue-components/webpack'{{/unless}}
{{#if (eq compiler "Vite") }}import Components from 'unplugin-vue-components/vite'{{/if}}

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig{{#if typescript }}<'{{ to_lower_case compiler }}'>{{/if}}(async (merge, { command, mode }) => {
  const baseConfig{{#if typescript }}: UserConfigExport<'{{ to_lower_case compiler }}'>{{/if}} = {
    projectName: '{{ projectName }}',
    date: '{{ date }}',
    designWidth (input) {
      // 配置 NutUI 375 尺寸
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: '{{ to_lower_case framework }}',
    compiler: {
      type: '{{ to_lower_case compiler }}'{{#if (eq compiler "Webpack5") }},
      prebundle: {
        enable: false
      }{{/if}}{{#if (eq compiler "Vite") }},
      vitePlugins: [
        Components({
          resolvers: [NutUIResolver({taro: true})]
        })
      ]{{/if}}
    },{{#if (eq compiler "Webpack5") }}
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },{{/if}}
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }{{#unless (eq compiler "Vite")}},
      webpackChain(chain) {
        {{#if typescript }}chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin){{/if}}
        chain.plugin('unplugin-vue-components').use(Components({
          resolvers: [NutUIResolver({taro: true})]
        }))
      }{{/unless}}
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      {{#unless (eq compiler "Vite")}}
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },{{/unless}}
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }{{#unless (eq compiler "Vite")}},
      webpackChain(chain) {
        {{#if typescript }}chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin){{/if}}
        chain.plugin('unplugin-vue-components').use(Components({
          resolvers: [NutUIResolver({taro: true})]
        }))
      }{{/unless}}
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})