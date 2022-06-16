// logs.js
const util = require('../../utils/util.js')

let logs = ''

Page({

  data: {
    logs: [],
    sum: [
      {
        title: '今日番茄次数',
        val: '0'
      },
      {
        title: '累计番茄次数',
        val: '0'
      },
      {
        title: '今日专注时长',
        val: '0分钟'
      },
      {
        title: '累计专注时长',
        val: '0分钟'
      },
    ],
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
    activeIndex: 0,
    dayList: [],
    list: []
  },

  onShow() {
    logs = wx.getStorageSync('logs') || []
    let day = 0
    let total = logs.length 
    let dayTime = 0
    let totalTime = 0
    let dayList = []
    if (logs.length > 0) {
      for (var i = 0; i < logs.length; i++) {
        if (logs[i].date.toString().substr(0,10) == util.formatTime(new Date).substr(0,10)) {
          day += 1
          dayTime += parseInt(logs[i].time)
          dayList.push(logs[i])
          this.setData({
            dayList: dayList,
            list: dayList
          })
        }
        totalTime += parseInt(logs[i].time)
      }
      this.setData({
        'sum[0].val': day,
        'sum[1].val': total,
        'sum[2].val': dayTime + '分钟',
        'sum[3].val': totalTime + '分钟'
      })
    }
  },

  changeType(event) {
    let index = event.currentTarget.dataset.index
    if (index == 0) {
      this.setData({
        list: this.data.dayList
      })
    } else if (index == 1) {
      this.setData({
        list: logs
      })
    }
    this.setData({
      activeIndex: index
    })
  }

})
