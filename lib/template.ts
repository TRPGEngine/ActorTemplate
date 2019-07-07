import Template from './models/Template';
import Group from './models/Group';
import Cell from './models/Cell';
import State from './models/State';
import Effect from './models/Effect';

export const getInitTemplate = function(name?) {
  return new Template(name);
};

export const getInitGroup = function(name?) {
  return new Group(name);
};

export const getInitCell = function(name?) {
  return new Cell(name);
};

export const getInitState = function(name, desc, priority) {
  return new State(name, desc, priority);
};

export const getInitEffect = function(name, attributes, priority) {
  return new Effect(name, attributes, priority);
};

export const stringify = function(template) {
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
  ]);
};

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

export const parse = function(str: string) {
  try {
    if (typeof str === 'object') {
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
      if (!!cell.list) {
        _groupIndex++;
        template.table[i] = parseGroup(cell);
      } else {
        template.table[i] = parseCell(cell);
      }
    }
    template._groupIndex = _groupIndex;
    return template;
  } catch (err) {
    throw new Error(err);
  }
};
