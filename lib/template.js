const Template = require('./models/Template');
const Group = require('./models/Group');
const Cell = require('./models/Cell');
const State = require('./models/State');
const Effect = require('./models/Effect');

let getInitTemplate = function(name) {
  return new Template(name);
}

exports.getInitTemplate = getInitTemplate;

let getInitGroup = function(name) {
  return new Group(name);
}

exports.getInitGroup = getInitGroup;

let getInitCell = function(name) {
  return new Cell(name);
}

exports.getInitCell = getInitCell;

exports.getInitState = function(name, desc, priority) {
  return new State(name, desc, priority);
}

exports.getInitEffect = function(name, attributes, priority) {
  return new Effect(name, attributes, priority);
}

exports.stringify = function(template) {
  return JSON.stringify(template, [
    // 允许的参数
    'name',
    'creator',
    'table',
    'desc',
    'createAt',
    'visibility',
    'ext',
    'parameter',
    'index',
    'pos',
    'list',
    'default',
    'func',
    'type',
    'value',
  ])
}

function parseGroup(groupObj) {
  let group = getInitGroup();
  group.visibility = groupObj.visibility;
  group.name = groupObj.name;
  group.index = groupObj.index;
  group.pos = groupObj.pos;
  group.list = groupObj.list;
  return group;
}

function parseCell(cellObj) {
  let cell = getInitCell();
  cell.visibility = cellObj.visibility;
  cell.name = cellObj.name;
  cell.default = cellObj.default;
  cell.func = cellObj.func;
  cell.type = cellObj.type;
  cell.value = cellObj.value;
  return cell;
}

exports.parse = function(str) {
  try {
    if(typeof str === 'object') {
      str = JSON.stringify(str);
    }
    let obj = JSON.parse(str);
    let template = getInitTemplate();
    template.name = obj.name;
    template.creator = obj.creator;
    template.createAt = obj.createAt;
    template.table = obj.table;
    let _groupIndex = 0;
    for (var i = 0; i < template.table.length; i++) {
      let cell = template.table[i];
      if(!!cell.list) {
        _groupIndex++;
        template.table[i] = parseGroup(cell);
      }else {
        template.table[i] = parseCell(cell);
      }
    }
    template._groupIndex = _groupIndex;
    return template;
  }catch(err) {
    throw new Error(err);
  }
}
