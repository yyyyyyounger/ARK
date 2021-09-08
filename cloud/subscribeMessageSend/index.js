const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gtulf1g864cd4ea',
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": wxContext.OPENID,   // 推送訂閱到調用該雲函數的user
        "templateId": 'cpl1QItBmdS4w43NRUeAjn-ZgDSulaaHk4IyMYRRhj4',
        "page" : './pages/index',
        "data": {
          "thing1": {             // 發起方
            "value": 'test1'
          },
          "thing6": {             // 活動名稱
            "value": 'test2'
          },
          "character_string10": { // 活動時間
            "value": 'test3'
          },
          "thing4": {             // 活動地點
            "value": 'test4'
          },
          "thing11": {            // 備註
            "value": 'test5'
          },
        },
      }) .then(res=>{
        return res;
      }) .catch (err=>{
        return err;
      })
    return result
  } catch (err) {
    return err
  }
}

// 定時觸發器
// "triggers": [
//   {
//     "name": "sendMessagerTimer",
//     "type": "timer",
//     "config": "0 */1 * * * ?"
//   }
// ]

// exports.main = async (event, context) => {
//   try {
//     const {OPENID} = cloud.getWXContext();
//     // 在云开发数据库中存储用户订阅的课程
//     const result = await db.collection('messages').add({
//       data: {
//         touser: OPENID,    // 订阅者的openid
//         page: 'index',     // 订阅消息卡片点击后会打开小程序的哪个页面
//         data: event.data,  // 订阅消息的数据
//         templateId: event.templateId, // 订阅消息模板ID
//         done: false,       // 消息发送状态设置为 false
//       },
//     });
//     return result;
//   } catch (err) {
//     console.log(err);
//     return err;
//   }
// };