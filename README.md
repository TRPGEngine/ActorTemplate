# ActorTemplate
actor template parser utils

a util for trpg actor to create template.

## Usage

```javascript
const at = require('trpg-actor-template');

let template = at.getInitTemplate();// 创建新模板卡
template.insertCell(at.getInitCell());// 在新模板中插入一个空白元素
template.insertGroup(at.getInitGroup());// 在新模板中插入一个空白组
template.insertGroup(at.getInitGroup().insertCell(at.getInitCell()));// 在新模板中插入一个有一个空白元素的空白组
```

## Serialize
```javascript
const at = require('trpg-actor-template');

let str = at.stringify(template);
let obj = at.parse(str);
```
