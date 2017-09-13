const Template = require('./models/Template');
const Group = require('./models/Group');
const Cell = require('./models/Cell');

let getInitTemplate = function() {
  return new Template();
}

exports.getInitTemplate = getInitTemplate;

let getInitGroup = function() {
  return new Group();
}

exports.getInitGroup = getInitGroup;

let getInitCell = function() {
  return new Cell();
}

exports.getInitCell = getInitCell;

exports.stringify = function(template) {
  return JSON.stringify(template, [
    'name',
    'creator',
    'table',
    'createAt',
    'visibility',
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

exports.parse = function(str) {
  try {
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
      }
    }
    template._groupIndex = _groupIndex;
    return template;
  }catch(err) {
    throw new Error(err);
  }
}
