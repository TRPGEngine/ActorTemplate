let at = require('../');

let template = at.getInitTemplate();
template.desc = '这是一个测试用的模板';
template.insertCell(at.getInitCell('姓名').setValue('亚丝娜'));
template.insertCell(at.getInitCell('年龄').setValue(22));
template.insertCell(at.getInitCell('性别').setValue('女'));
template.insertCell(at.getInitCell('职业').setValue('刺剑使'));
template.insertCell(at.getInitCell('力量').setValue('10'));
template.insertCell(at.getInitCell('敏捷').setValue('15'));
template.insertCell(at.getInitCell('耐力').setValue('12'));
template.insertCell(at.getInitCell('智力').setValue('8'));
template.insertCell(at.getInitCell('魅力').setValue('11'));
template.insertCell(at.getInitCell('生命值').setFunc('expression').setDefault('({{力量}}*0.5 + {{耐力}}*2)*10'));
template.insertCell(at.getInitCell('魔法值').setFunc('expression').setDefault('({{魅力}}*0.5 + {{智力}}*2)*10'));
template.insertCell(at.getInitCell('物理攻击力').setFunc('expression').setDefault('{{力量}}*3 + {{敏捷}}*1'));
template.insertCell(at.getInitCell('魔法攻击力').setFunc('expression').setDefault('{{智力}}*4'));


console.log('========组成数据:========\n', template);

console.log('========获取属性:========\n', template.getData());

// console.log('========重整属性:========\n', template.setData(JSON.stringify(template.getData())).getData());
