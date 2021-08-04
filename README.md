# ARK Develop log

## 項目文件目錄結構說明

 - 開發中：
   - ARK協議頁
   - 主頁
   - 課程頁
     - 課程detail頁
     - 課程編輯
   

 - 已完成(完成度較高):
   - user頁 & 個人信息編輯mode & 註冊
   - 其他頁基本佈局

## 開發者備註
 - 使用 `Vant` 作為組件庫。[傳送門][1]
 - 使用 `ColorUI` 作為樣式庫。[傳送門][2] [Github Page][3]
 - master分支為穩定版庫，dev分支為開發版庫

## 開發日誌
#### 2021-6-23
對editPage.js寫入了保留上次輸入的邏輯，便於用戶修改。


#### 2021-6-24
input輸入框增加了一鍵清除按鈕。

**已知bug：** 一鍵清除按鈕的樣式有bug，邏輯已實現。


#### 2021-6-25
6-23的bug已解決，開始進行index頁的編寫，完善了部分交互體驗。完成功能：“剩餘多少天、已過多少天”。


#### 2021-6-26
新增了許多頁面結構，等待寫好的其他人寫好頁面進行整合。


#### 2021-6-27
為user頁增加了progress顯示，完善了部分計日期的算法。添加了全局下拉動作，某些頁面配置了下拉刷新(調用onLoad)。


#### 2021-6-28
新增了些花里胡哨的東西（動畫）。


#### 2021-7-1
對user頁的微信登錄邏輯進行修改。


#### 2021-7-2
在寫註冊邏輯。轉戰Vant組件庫。

**已知bug：** 用戶會有多種操作狀態，需要一一列舉，畫出狀態機才能繼續編程。


#### 2021-7-3
究極大重寫，界面好看了不少。



#### 2021-7-4
發現js的究極特性！！！使用下方代碼才能好好複製數組！！而使用`let`、`var`、`setData`變量`a` = 變量`b`都只是引用變量`b`，本質上數據互相綁定。
    
    var b = JSON.parse(JSON.stringify(數組a));  //複製一份數組a的數據到數組b



#### 2021-7-5
對頁面做了一些美化，指定了課程數據的格式。詳見`根目錄/data/cloudData_Course.js`。
有空更新Vant！！！！根目錄下運行：

    npm i @vant/weapp -S --production


#### 2021-7-6
開始製作 /pages/category 所有課程頁。


#### 2021-7-7
嘗試使用雲服務繞過HTTPS合法域名檢測，參考blog：~~https://developers.weixin.qq.com/community/develop/doc/000c82801a45e8ca18c7e8fba51800~~ 。
~~失敗~~


#### 2021-7-9
成功實現Markdown在小程序的渲染。
關鍵實現：使用 `` 符號 ` `` 括住markdown，進行無視空格的引用。然後匯入變量。
小程序使用towxml作為markdown組件庫解析渲染，該組件庫還有html渲染模式！
詳情前往 ``pages/protocol/`` 查看具體實現！
1.0.4體驗版，苦惱課程頁表現形式中...


#### 2021-7-10
對`新增課程頁面`配置了樣式和Date、Time選擇器 - 未完成。還有一些自動的細節需要改善，選填部分未完成。


#### 2021-7-11
已整合有http請求返回功能的雲函數 by Kalo。
正在進行課程頁的數據處理，是個龐大的工程。。


#### 2021-7-12
編寫course的follow狀態切換功能中...。


#### 2021-7-15
休息幾天後再度開戰。今天進行了總的ARK小程序團隊討論。
雲函數 & 數據庫使用流程：

  1. **必須：** 建議在 `app.js` 的 `OnLaunch()` 中調用
```
  wx.cloud.init({
    env: '當前雲開發環境id例如cloud1-xxxxxxxxx'
  })
```
已經實現獲取用戶openid和儲存用戶頭像、暱稱等信息於雲數據庫。


#### 2021-7-16
思考用戶與雲端的交互邏輯中，如何更小地進行讀、寫操作？
探索雲開發、Promise特性中。。。挖坑。


#### 2021-7-19
已掌握Promise基本用法和適用處。使用orderBy實現按 `升序asc / 降序desc` 排列某集合的記錄，使用時多加上 `field(控制只顯示某條字段的記錄)` 或 `limit(控制顯示多少記錄)` 。


#### 2021-7-20
user頁與數據庫互動基本完成。
**已知bug：** 修改數據時的相同數據判定有bug，推測是app的數據沒有合理更新，準備使用緩存。


#### 2021-7-22
按照凱哥的建議對部分樣式進行了修改。


#### 2021-7-23
更新了README.md，**對目前的程序結構寫了新說明，放在 `/備註/協同開發.md` 上。**


#### 2021-7-25
寫好了添加helper的邏輯。**但沒加前端的輔助提示。**


#### 2021-7-26
我要開課頁完成與數據庫的綁定，添加了頁面的提示邏輯和跳轉。**待修改：開啟小程序必定會清緩存的bug。**


#### 2021-7-27
新增日期投票模式下的時間段設置。優化了一些視覺和交互小細節。**待添加輸入校驗，修改了timePicker的數據格式還未進行校驗**


#### 2021-7-28
對user頁添加了骨架屏加載效果，體驗一級棒！
究極優化的生成對象算法！But單個設定/渲染時適用對象形式數據，for循環時適用數組數據操作。
```
  let shortNameIndex={};
  this.data.courseInfoInput.map(function (e, item) {    // 究極優化！本質上一行代碼匹配出所有index
    shortNameIndex[e.shortName] = e.id;
  });
```


#### 2021-7-29
製作課程詳情頁中。。。稍有頭緒，仍在試探。今天還修了幾個bug。


#### 2021-7-30
新增管理員權限下可以編輯課程的edit和display參數。沒有什麼大改動，還有半個月要上線，焦慮。


#### 2021-7-31
轉眼已經7月最後一天，，，課程数据新增使用時間戳表示所選時間，方便比較出最新的課程。
8.1計劃：完成課程詳情頁，follow按鈕邏輯。


#### 2021-8-1
follow按鈕邏輯大致完成，差訂閱的邏輯。
8.2計劃：完成課程詳情頁。


#### 2021-8-2
麼都冇做，看re0去了😁。為了放鬆~~摸魚~~一下，明天開干。


#### 2021-8-3
與凱哥進行課程詳情頁的設計中。


#### 2021-8-3
與凱哥進行課程詳情頁的設計中。


#### 2021-8-4
完成了基本的頁面帶參跳轉邏輯，明天計劃：主頁顯示Follow的課程。





  [1]: https://youzan.github.io/vant-weapp/#/home
  [2]: http://demo.color-ui.com/
  [3]: https://github.com/weilanwl/ColorUI
