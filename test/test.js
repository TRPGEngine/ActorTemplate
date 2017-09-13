let at = require('../');

let template = at.getInitTemplate();
template.insertCell(at.getInitCell());
template.insertGroup(at.getInitGroup());
template.insertGroup(at.getInitGroup().insertCell(at.getInitCell()));
template.insertGroup(at.getInitGroup());

// console.dir(template, {depth:4});
// console.log('JSON string:\n', JSON.stringify(template));

console.log('========组成数据:========\n', template);
console.log('========序列化数据:========\n',at.stringify(template));
console.log('========解析数据:========\n', at.parse(at.stringify(template)));
