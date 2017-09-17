let at = require('../');

let template = at.getInitTemplate();
let cell1 = at.getInitCell()
template.insertCell(cell1);
template.insertGroup(at.getInitGroup());
let cell2 = at.getInitCell();
template.insertGroup(at.getInitGroup().insertCell(cell2));
template.insertGroup(at.getInitGroup());

// console.dir(template, {depth:4});
// console.log('JSON string:\n', JSON.stringify(template));

console.log('========组成数据:========\n', template);
// console.log('========序列化数据:========\n',at.stringify(template));
// console.log('========解析数据:========\n', at.parse(at.stringify(template)));

template.removeCell(cell2);
console.log('========删除数据:========\n', template);
