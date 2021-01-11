## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```
$ git clone https://github.com/heroku/xxx.git
$ cd xxx
$ npm install
$ npm start
```
(http://localhost:5000/)

## Deploying new to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```

## Deploying for update to Heroku

```
$ git add .
$ git commit -m '內容'
$ git push heroku main
$ heroku open
```

## View Log

$heroku logs --tail

## Local

$ heroku local  
(http://localhost:5000/)

## 縮放應用

可以使用以下ps命令檢查正在運行的測功機  
$ heroku ps  
將網絡測功的數量縮放為零：  
$ heroku ps:scale web=0  
再次擴大規模：  
$ heroku ps:scale web=1  

## 啟動控制台

$ heroku run bash  
~ $ ls  
~ $ exit  

## remote專案

$ heroku git:remote -a 專案名

## Config Production環境變數

$ heroku config:set key=value  
.env是local的環境變數記得加入.gitignore

## Types of MongoDB

name:    String,  
binary:  Buffer,  
living:  Boolean,  
updated: { type: Date, default: Date.now },  
age:     { type: Number, min: 18, max: 65 },  
mixed:   Schema.Types.Mixed,  
_someId: Schema.Types.ObjectId,  
decimal: Schema.Types.Decimal128,  
array: [],  
ofString: [String],  
ofArrays: [[]],  
ofArrayOfNumbers: [[Number]],  
nested: {  
  stuff: { type: String, lowercase: true, trim: true }  
},  
map: Map,  
mapOfString: {  
  type: Map,  
  of: String  
}  

## KK

元音                            輔音
單元音           雙元音          清音             濁音  
KK	 單字        KK   單字       KK   單字       KK	    單字  
[æ]	 fat        [aɪ]	pie      [p]   pet       [b]	  book  
[ɪ]	 sit        [aᴜ]	house    [t]   ten       [d]    desk  
[e]	 pain       [ɔɪ]	coin     [k]	 key       [g]	  get  
[ɛ]	 head                      [f]	 fat       [v]    vest  
[i]	 seat                      [s]   sing      [z]    zoo  
[ɑ]	 hot                       [θ]	 thank     [ð]    this  
[o]	 nose                      [ʃ]	 short     [ʒ]    measure  
[ɔ]	 four                      [tʃ]  chair     [dʒ]   john  
[ɔ]	 dog                       [h]	 hat       [m]	  mom  
[u]	 too                                       [n]    nose             
[ᴜ]	 put                                       [ŋ]    sing  
[ʌ]	 sun                                       [l]    long  
[ə]	 again                                     [r]    red  
[ɪr] rear                                      [j]	  yes  
[ɚ]	 brother                                   [w]		we  
[ɝ]	 bird  