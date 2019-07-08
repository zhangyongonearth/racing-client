module.exports = {
  pages: {
    xuanshou: {
      // 应用入口配置，相当于单页面应用的main.js，必需项
      entry: 'src/pages/xuanshou/xuanshou.js',

      // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
      template: 'public/index.html',

      // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
      filename: 'xuanshou.html',

      // 标题，可选项，一般情况不使用，通常是在路由切换时设置title
      // 需要注意的是使用title属性template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'xuanshou',

      // 包含的模块，可选项
      chunks: ['xuanshou']
    },
    zhuchi: {
      entry: 'src/pages/zhuchi/zhuchi.js',
      template: 'public/index.html',
      filename: 'zhuchi.html',
      title: 'zhuchi',
      chunks: ['zhuchi']
    },
    screen: {
      entry: 'src/pages/screen/screen.js',
      template: 'public/index.html',
      filename: 'screen.html',
      title: 'screen',
      chunks: ['screen']
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.module.rules.delete('svg')
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
    //   .include
    //   .add() //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
        include: ['src/icons']
      })
  }
}
