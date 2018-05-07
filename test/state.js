const at = require('../');

let template = at.getInitTemplate();
template.desc = '这是一个测试用的模板';
template.insertCell(at.getInitCell('姓名').setValue('亚丝娜'));
template.insertCell(at.getInitCell('力量').setValue(10));
template.insertCell(at.getInitCell('耐力').setValue(12));
template.insertCell(at.getInitCell('生命值').setFunc('expression').setDefault('({{力量}}*0.5 + {{耐力}}*2)*10'));
console.log('========原始数据:========\n', template.eval().getData());
template.insertState(
  at.getInitState('生命盔甲')
    .appendEffect(at.getInitEffect('生命提升', [
      {name: '生命值',value: '+20'},
      {name: '耐力',value: '+2'}
    ]))
);
template.insertState(
  at.getInitState('力量头盔', '', 1)
    .appendEffect(at.getInitEffect('力量提升', [{name: '力量',value: '+2'}]))
);

// console.log('========组成数据:========\n', template);
console.log('========状态列表:========\n', template.getStateEffects());
console.log('========状态计算前数据:========\n', template.evalState().getOriginData());
console.log('========状态计算后数据:========\n', template.evalState().getData());
