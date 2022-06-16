// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    timer: null,
    cateArr: [
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: '阅读'
      }
    ],
    cateActive: '0',
    time: '25',
    mTime: 1500000,
    rate: '',
    clockShow: false,
    clockHeight: 0,
    timeStr: "25:00",
    finishShow: false,
    pauseShow: true,
    continueCancelShow: false
  },
 
  onLoad() {
    // 750rpx
    let res = wx.getSystemInfoSync()
    console.log('wx.getSystemInfoSync()返回的数据是',res)
    // 750 / res.windowWidth = ? / res.windowHeight
    let rate = 750 / res.windowWidth
    console.log('rate值为:',rate)
    let clockHeight = rate * res.windowHeight
    this.setData({
      rate: rate,
      clockHeight: clockHeight
    })
  },

  sliderChange(event) {
    // console.log("拖动后的数据",event)
    this.setData({
      time: event.detail.value
    })
  },

  clickCate(event) {
    // console.log("点击Cate后返回的数据",event)
    this.setData({
      cateActive: event.currentTarget.dataset.index
    })
  },

  start() {
    this.setData({
      clockShow: true,
      mTime: this.data.time*60*1000,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00'
    })
    this.drawBg()
    this.drawActive()
  },

  // 黑色背景圆
  drawBg() {
    // 旧方法，现在推荐使用 canvas 2d
    let lineWidth = 6 / this.data.rate // rpx => px
    let ctx = wx.createCanvasContext("progress_bg")
    ctx.setLineWidth(lineWidth) // 设置宽度
    ctx.setStrokeStyle('#000000') // 填充颜色
    ctx.setLineCap('round') // 设置断点形状
    ctx.beginPath() // 开始新的路径
    ctx.arc(400/this.data.rate/2, 400/this.data.rate/2, 400/this.data.rate/2-lineWidth*2,0,2*Math.PI,false) // 调用arc画圆
    ctx.stroke()
    ctx.draw()

    // canvas 2d 实现
  },

  drawActive() {
    let timer = setInterval(() => {
      // 1.5 - 3.5
      let angle = 1.5 + 2*(this.data.time*60*1000 - this.data.mTime) / (this.data.time*60*1000)
      let currentTime = this.data.mTime - 100
      this.setData({
        mTime: currentTime
      })
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          let timeStrSeconds = currentTime / 1000 // s 
          let timeStrMinutes = parseInt(timeStrSeconds / 60) // m
          let timeStrBack = (timeStrSeconds - timeStrMinutes*60) >= 10 ? (timeStrSeconds - timeStrMinutes*60) : '0' + (timeStrSeconds - timeStrMinutes*60)
          timeStrMinutes = timeStrMinutes >= 10 ? timeStrMinutes : '0' + timeStrMinutes
          this.setData({
            timeStr: timeStrMinutes + ':' + timeStrBack
          })
        }
        // 旧方法，现在推荐使用 canvas 2d
        let lineWidth = 6 / this.data.rate // rpx => px
        let ctx = wx.createCanvasContext("progress_active")
        ctx.setLineWidth(lineWidth) // 设置宽度
        ctx.setStrokeStyle('#ffffff') // 填充颜色
        ctx.setLineCap('round') // 设置断点形状
        ctx.beginPath() // 开始新的路径
        ctx.arc(400/this.data.rate/2, 400/this.data.rate/2, 400/this.data.rate/2-lineWidth*2,1.5*Math.PI,angle*Math.PI,false) // 调 用 arc画圆
        ctx.stroke()
        ctx.draw()

        // canvas 2d 实现
        
      } else {
        let logs = wx.getStorageSync('logs') || []
        logs.unshift({
          date: util.formatTime(new Date),
          cate: this.data.cateActive,
          time: this.data.time
        })
        wx.setStorageSync('logs', logs) 
        this.setData({
          timeStr: '00:00',
          finishShow: true,
          pauseShow: false
        })
        clearInterval(timer)
      }
      this.setData({
        timer: timer
      })
    }, 100);
  },

  pause() {
    clearInterval(this.data.timer)
    this.setData({
      pauseShow: false,
      continueCancelShow: true,
      finishShow:  false 
    })
  },

  continue() {
    this.drawActive()
    this.setData({
      finishShow: false,
      pauseShow: true,
      continueCancelShow: false
    })
  },

  cancel() {
    clearInterval(this.data.timer)
    this.setData({
      finishShow: false,
      pauseShow: true,
      continueCancelShow: false,
      clockShow: false
    })
  },

  finish() {
    clearInterval(this.data.timer)
    this.setData({
      finishShow: false,
      pauseShow: true,
      continueCancelShow: false,
      clockShow: false
    })
  }

}) 
