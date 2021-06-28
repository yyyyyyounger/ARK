# ARK_Developing_version

## 項目文件目錄結構說明

 - 開發中：
   - 註冊頁
   - ARK協議頁
   - 主頁
   - 其他頁

 - 已完成(完成度較高):
   - user頁
   - user頁的編輯個人信息頁


## 頁面查看說明
在根目錄 `/ARK` (默認)的 `app.json` 中切換 `pages` 的路徑順序即可查看效果。

**注意：** 某些功能必須在某個頁面載入才能發生，例如想測試個人信息更新時直接打開 `editPage` ，和在 `user` 頁中打開 `editPage` 有所不同，正常使用邏輯應在 `個人頁` 中點選進入 `編輯頁` 。

## 開發者備註
若要達到某些組件的效果需要引入 WeUI

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

<!-- **已知bug：**  -->


#### 2021-6-28
新增了些花里胡哨的東西（動畫）。
