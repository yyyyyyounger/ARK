var app = getApp();
const db = wx.cloud.database();   // 數據庫
const _ = db.command

import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Page({
  data: {
    // follow狀態
    haveFollow : false,
    // 骨架屏
    loading:true,
    // 步驟條 - begin
    numList: [{
      name: '填寫信息'
      }, {
        name: '提交管理員審核'
      }, {
        name: '課程發佈'
      }, 
    ],
    stepsActive:1,    // 控制步驟條active
    // 步驟條 - end
  },
  onLoad: function(options){
    this.app = getApp();
    // 獲取上個頁面傳遞的參數，說明用戶組和需要渲染的courseId
    let detailInfo = JSON.parse(options.detailInfo);
    this.setData({  detailInfo  })
    console.log("上個頁面傳遞值為：",this.data.detailInfo)

    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存
    // 從緩存中獲取該用戶是否管理員
    this.setData({
      admin         : userCloudDataStorage.data.admin,
      userCloudData : userCloudDataStorage.data,
    })

    // 請求雲端的courseInfo數據，該courseId為num類型
    this.returnCourseData();
  },
  onReady() {
    console.log("課程詳情頁 - 已经Ready");
  },
  onShow() {
    this.onPullDownRefresh();
  },
  // 請求數據庫返回該courseId的數據
  returnCourseData (){
    const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶緩存

    // 請求雲端的courseInfo數據，該courseId為num類型
    db.collection('course') .doc(this.data.detailInfo.courseId) .get()
    .then(res=>{
      console.log("該courseId在數據庫儲存的數據為：",res.data);
      this.setData({  courseCloudData : res.data  })
      this.setData({  courseInfoInput : this.data.courseCloudData.courseInfoInput  })
      this.ArrayDataInit(this);   // 數據操作數組、對象等的初始化

      let followMember = this.data.courseCloudData.followMember;
      // 判斷是否follow了該課程，follow狀態更改wxml的按鈕形態
      followMember.forEach(item=>{
        if(item.arkid==userCloudDataStorage.data.arkid){
            console.log("這個用戶已follow了這個課程！");
            this.setData({  haveFollow : true  })
        }
    })

      this.setData({  loading: false,  }) // 骨架屏消失
    }) .catch(err=>{  console.error(err);  })
  },
  // 匹配shortName對象，單個渲染/設定時適用對象，for循環時適用數組
  findSetData(shortNameArray) {
    // 匹配出shortName的index，生成為一個對象形式
    let shortNameIndex={};
    this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
      shortNameIndex[e.shortName] = e.id;
    });
    this.setData({  shortNameIndex  })
    // console.log("shortNameIndex為",shortNameIndex);

    // 匹配出shortName的display權限，生成為一個對象形式
    let shortNameDisplay={};
    this.data.courseInfoInput.map(function (e, item) {
      shortNameDisplay[e.shortName] = e.display;
    });
    this.setData({  shortNameDisplay  })
    // console.log("shortNameDisplay為",shortNameDisplay);
  },
  // 初始化各種數組
  ArrayDataInit(that) {
    // 生成 無input版 courseInfo的shortName數組
    let shortNameArray = that.data.courseInfoInput.map((item)=>{    return item.shortName   });
    // 生成userInfoInput裡允許顯示的設置數組
    let InfoDisplay = that.data.courseInfoInput.map((item)=>{    return item.display   });
    // 生成userInfoInput裡允許編輯的設置數組
    let canEdit     = that.data.courseInfoInput.map((item)=>{    return item.canEdit    });
    // 允許編輯/顯示 → setData
    that.setData({    InfoDisplay, canEdit, shortNameArray    });
    // 初始化所有index值
    that.findSetData(shortNameArray);
  },

  onPullDownRefresh: function(){
    this.returnCourseData();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onShareAppMessage: function(){

  },

  addFollow (e) {
    const userCloudDataStorage = wx.getStorageSync('userCloudData');
    if (userCloudDataStorage) {    // 已登錄才可以操作
      Dialog.confirm({
        title: '操作提示',
        message: '自己follow的課要好好上完喔！😎',
        zIndex:99999999,
      })
      .then(res=>{            // on confirm
        // 加載提示
        Toast.loading({
          message: '拼命加載中...',
          forbidClick: true,
        });
        // 正常應該只能follow 20節課，獲取資料的時候默認20條記錄限制 - 好像沒有寫
        
        let selectCourse = this.data.courseCloudData._id;  // 記錄Follow的課程id
        console.log("請求add",selectCourse);
    
        // 雲函數更新 - user集合 - recentFollowIdArray數組
        const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
        // 權限問題需要調用雲函數
        // user基本信息導入到該courseId的followMember數組內
        wx.cloud.callFunction({
          name : 'courseFollowMember',
          data : {
            mode          : "add",
            selectCourse  : selectCourse,
            endTimeStamp  : this.data.courseCloudData.timeStampPick,
            arkid         : userCloudDataStorage.data.arkid,
            avatarUrl     : userCloudDataStorage.data.avatarUrl,
            name          : userCloudDataStorage.data.userInfoInput[1].input,
          }
        }) .then(res=>{         // 寫入自己的follow列表
          db.collection('user').doc(userCloudDataStorage.data._openid).update({
            data: {
              recentFollowIdArray: _.push([selectCourse]),
            }
          }) .then(res=>{       // 成功提示 & 同步wxml的顯示
            Toast('Follow成功！課程編號：'+selectCourse+'\n可前往 “我的Follow” 查看');
            this.setData({  haveFollow : true  })
          })
        }) .catch(err=>{        // 失敗提示
          console.error(err);
          Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
        })
        
        // 詢問是否同意微信訂閱 開課消息
      })                      // on confirm - end
      .catch(res=>{           // on cancel
      })
    }
    else {                  // 未登錄提示登錄
      Dialog.confirm({
        title: '操作提示',
        message: '該功能需要登錄後操作！\n現在去登錄嗎？',
        zIndex:99999999,
      })
      .then(() => {   // on confirm
        wx.switchTab({
          url: '../user/user',
        })
      })
      .catch(() => {  // on cancel
        
      });
    }
  },
  deleteFollow(e){
    // 防誤觸式提問
    Dialog.confirm({
      title: '重要提示',
      message: '就這麼忍心說ByeBye嗎？😭',
      zIndex:99999999,
    })
    .then(() => {     // on confirm
      Toast.loading({   // 加載提示
        message: '拼命加載中...',
        forbidClick: true,
      });

      // 記錄Follow的課程id
      let selectCourse = this.data.courseCloudData._id;
      console.log("請求delete",selectCourse);

      // 調用雲函數更新 - user集合 - recentFollowIdArray數組
      const userCloudDataStorage = wx.getStorageSync('userCloudData');  // 用戶數據緩存
      wx.cloud.callFunction({   // 刪除followMember數組內該user的arkid等數據
        name : 'courseFollowMember',
        data : {
          mode          : "delete",
          endTimeStamp  : this.data.courseCloudData.timeStampPick,
          selectCourse  : selectCourse,
          arkid         : userCloudDataStorage.data.arkid,
        }
      }) .then(res=>{           // 刪除自己的follow列表
        db.collection('user').doc(userCloudDataStorage.data._openid).update({
          data: {
            recentFollowIdArray: _.pull(_.in([selectCourse]))
          }
        }) .then(res=>{         // 成功提示 & 同步wxml的顯示
          Toast('刪除成功！');
          this.setData({  haveFollow : false  })
        }) .catch(err=>{ console.error(err); })
      }) .catch(err=>{             // 失敗提示
        console.error(err);
        Notify({ type: 'warning', message: '操作失敗！請刷新頁面或聯繫管理員！' });
      })
    })  // on confirm - end
    .catch(() => {    // on cancel
    });
  },

  // 下載文件
  downLoadFile(e) {
    let selectIndex = e.currentTarget.dataset.index;
    let size = this.data.courseCloudData.filePaths[selectIndex].size;
    let mes;
    if (size>1000) {
      size = size/1000000;
      mes = size.toFixed(2)+" MB";
      console.log(mes);
    } else {
      size = size/100;
      mes = size.toFixed(2)+" KB";
      console.log(mes);
    }
    Dialog.confirm({
      title: '操作提示',
      message: '確定獲取文件：\n "'+this.data.courseCloudData.filePaths[selectIndex].name+'"\n('+mes+')'+' 的下載鏈接嗎？',
    }) .then(res=>{
      let path = this.data.courseCloudData.filePaths[selectIndex].path;
      db.collection('fileList') .where({
        'fileInfo.path' : path,
      }) .field({  cloudFileId : true  }) .get() .then(res=>{
        // 獲取可下載的真實鏈接
        wx.cloud.getTempFileURL({
          fileList : [res.data[0].cloudFileId]      // 傳參為數組形式
        }) .then(res => {
          Toast.success('獲取成功！');
          // 寫入用戶粘貼板
          wx.setClipboardData({
            data: res.fileList[0].tempFileURL,    // 可下載的真實鏈接
            success (res) {
              Toast('已複製鏈接到粘貼板，\n可前往瀏覽器打開！');
            }
          })
        }).catch(error => {  console.error(error);  })
      })
    })
  },

  // 步驟條
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  // 下一步 - 按鈕觸發
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 1 : this.data.num + 1
    })
  },

  // 跳轉編輯頁
  editInfo() {
    let detailInfo = {
      user             :   "speaker",
      courseCloudData  :   this.data.courseCloudData,
    }
    detailInfo = JSON.stringify(detailInfo);
    wx.navigateTo({
      url: '../holdACourses/holdACourses?detailInfo=' + detailInfo,
    })
  },

});