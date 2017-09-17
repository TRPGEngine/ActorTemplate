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

let template = at.getInitTemplate();
// ...

let str = at.stringify(template);
let obj = at.parse(str);
```

## API

#### Template
- `insertGroup(group)` 插入分组
- `insertCell(cell)` 插入元素
- `getCells()` 迭代获取元素列表
- `removeCell(cell)` 删除指定元素
- `eval()` 执行模板方法结果运算
- `getData()` 输出信息对象列表(形如`[{name: value},{name: value},...]`)
- `setData(obj)` 给模板分配信息(模板中没有元素的信息列表会被忽略)

#### Group
- `insertCell(cell)` 插入元素
- `getCells()` 迭代获取元素列表
- `removeCell(cell)` 删除指定元素

#### Cell
- `setVisibility(val)` 配置可见性
- `setDefault(val)` 配置默认值(如计算方式为表达式，该项为表达式函数)
- `setFunc(val)` 配置计算方式
- `setType(val)` 配置数据类型
- `setValue(val)` 配置数据值
