# GeekCash Explorer

An open source block explorer written in Vue.js.

```
git clone git@github.com:aiodex/explorer.aiodex.com.git explorer
cd explorer
npm i
npm run dev
```

### Insert New Coin
```

db.coins.insert([
    {
	"_id" : "GEEK",
    "nm" : "GeekCash",
	"at" : NumberInt("1539582015"),
	"h" : NumberInt("1"),
	"idx" : NumberInt("1"),
	"mn" : NumberInt("0"),	
	"pow" : 0,	
	"img" : "https://i.imgur.com/cflyKX4.png",
	"stt" : NumberInt("1"),
	"diff" : 0,
	"sup" : 0,
    "lb"  :{
        "GVhg8uNbKmARKRLExsCcVFG2jjD9Cza18Z": "Geek Foundation",
        "GXpeHUXwiAMRazqWtih5EcxUNGUE67TBLu": "Aiodex"
    }
}])

```
### Sync
```
node sync
```

## MongoDB Index
```
db.tx.createIndex({ "cid": 1, tt: -1 }, { background: true });
db.tx.createIndex({ "bid": 1, tt: -1 }, { background: true });

db.addresses.createIndex({ "cid": 1, bl: -1 }, { background: true });
db.addresses.createIndex({ at: 1 }, { background: true });

db.transactions.createIndex({ "wid":1 ,"tt":-1 }, { "background" : true });
db.transactions.createIndex({ "cid":1 ,"tt":-1 }, { "background" : true });

db.masternodes.createIndex({ "cid":1 ,"idx":-1 }, { "background" : true });
```

### See it in action

[explorer.aiodex.com](https://explorer.aiodex.com)

### MIT License

Copyright (c) 2018, Aiodex Team ([Aiodex](https://aiodex.com)) 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.