<template>
  <div id="app">
    <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
    <ResumeEditor ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></ResumeEditor>
  </div>
</template>

<script>
  import StyleEditor from '../components/StyleEditor'
  import ResumeEditor from '../components/ResumeEditor'
  import '../assets/reset.css'
  export default {
    name: 'app',
    components: {
      StyleEditor,
      ResumeEditor
    },
    data() {
      return {
        interval: 1,
        currentStyle: '',
        enableHtml: false,
        fullStyle: [
`/**
  * 大家好，我是庞晓豹
  * 这是我的个人简历 ^_^
  */
  /* 首先给所有元素加上过渡效果 */
  * {
    transition: all .3s;
  }
  /* 白色背景太单调了，我们来点背景 */
  html {
    color: rgb(222,222,222); background: rgb(0,42,54);
  }
  /* 文字离边框太近了 */
  .styleEditor {
    padding: .5em;
    border: 1px solid;
    margin: .5em;
    overflow: auto;
    width: 45vw; height: 90vh;
  }
  /* 代码高亮 */
  .token.selector{ color: rgb(133,153,0); }
  .token.property{ color: rgb(187,137,0); }
  .token.punctuation{ color: yellow; }
  .token.function{ color: rgb(42,161,152); }
  /* 加点 3D 效果呗 */
  html{
    perspective: 1000px;
  }
  .styleEditor {
    position: fixed; left: 0; top: 0;
    -webkit-transition: none;
    transition: none;
    -webkit-transform: rotateY(10deg) translateZ(-100px) ;
            transform: rotateY(10deg) translateZ(-100px) ;
  }
  /* 接下来我给自己准备一个编辑器 */
  .resumeEditor{
    position: fixed; right: 0; top: 0;
    padding: .5em;  margin: .5em;
    width: 48vw; height: 90vh;
    border: 1px solid;
    background: white; color: #222;
    overflow: auto;
  }
  /* 好了，我开始写简历了 */
  `,
            `
  /* 这个简历好像差点什么
  * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
  * 简单，用开源工具翻译成 HTML 就行了
  */
  `,

  `
  /* 再对 HTML 加点样式 */
  .resumeEditor{
    padding: 2em;
  }
  .resumeEditor h2{
    display: inline-block;
    border-bottom: 1px solid;
    margin: 1em 0 .5em;
  }
  .resumeEditor ul,.resumeEditor ol{
    list-style: none;
  }
  .resumeEditor ul> li::before{
    content: '•';
    margin-right: .5em;
  }
  .resumeEditor ol {
    counter-reset: section;
  }
  .resumeEditor ol li::before {
    counter-increment: section;
    content: counters(section, ".") " ";
    margin-right: .5em;
  }
  .resumeEditor blockquote {
    margin: 1em;
    padding: .5em;
    background: #ddd;
  }`],

        currentMarkdown: '',
        fullMarkdown: `庞晓豹
----
资深前端工程师，目前就职于杭州帅拓网络软件部。
个人技能
----
* 精通 html5，css3，javascript，了解 typescript。
* 熟悉 vue.js + vue-router + vuex + es6 + webpack + axios + sass + karma 技术栈。
* 了解 node.js + koa2 + koa-router+ Sequelize-cli 技术栈。
* 熟悉微信小程序和微信公众号以及钉钉 E 应用开发。
* 熟练使用 element-ui，vux-ui，vant-ui，cube-ui 结合 px2rem 构建跨端应用。
* 熟练使用 vue.js, 并理解其设计原理，以及开发自己的 ui 组件库，并对其进行自动化集成测试。
* 使用 Electron 构建跨平台的桌面应用。
* 了解 linux 服务器的搭建以及项目部署。

工作职责
----
* 承担 web 前端核心模块的设计、实现工作。
* 承担主要开发工作， 对代码质量及进度负责。
* 参与进行关键技术验证以及技术选型工作。
* 参与需求分析， 预估开发时间。
* 参与公司 ui 框架的开发。

工作经历
----
* 2018.4-至今 杭州帅拓网络科技有限公司。
* 2016.9-2018.4 杭州爱聚科技有限公司。
* 2015.8-2016.8 上海文军科技有限公司。

链接
----
* [GitHub](https://github.com/18037166365/resume)
`
      }
    },
    created() {
      this.makeResume()
    },
    methods: {
      makeResume: async function () {
        await this.progressivelyShowStyle(0)
        await this.progressivelyShowResume()
        await this.progressivelyShowStyle(1)
        await this.showHtml()
        await this.progressivelyShowStyle(2)
      },
      showHtml: function () {
        return new Promise((resolve, reject) => {
          this.enableHtml = true
          resolve()
        })
      },
      progressivelyShowStyle(n) {
        return new Promise((resolve, reject) => {
          let interval = this.interval
          let showStyle = (async function () {
            let style = this.fullStyle[n]
            if (!style) { return }
            // 计算前 n 个 style 的字符总数
            let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
            let prefixLength = length - style.length
            if (this.currentStyle.length < length) {
              let l = this.currentStyle.length - prefixLength
              let char = style.substring(l, l + 1) || ' '
              this.currentStyle += char
              if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
                this.$nextTick(() => {
                  this.$refs.styleEditor.goBottom()
                })
              }
              setTimeout(showStyle, interval)
            } else {
              resolve()
            }
          }).bind(this)
          showStyle()
        })
      },
      progressivelyShowResume() {
        return new Promise((resolve, reject) => {
          let length = this.fullMarkdown.length
          let interval = this.interval
          let showResume = () => {
            if (this.currentMarkdown.length < length) {
              this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1)
              let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1]
              let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2]
              if (prevChar === '\n' && this.$refs.resumeEditor) {
                this.$nextTick(() => this.$refs.resumeEditor.goBottom())
              }
              setTimeout(showResume, interval)
            } else {
              resolve()
            }
          }
          showResume()
        })
      }
    }
  }
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    min-height: 100vh;
  }
  *{
    box-sizing: border-box;
  }
</style>
