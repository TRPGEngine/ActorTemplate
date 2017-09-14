const Group = require('./Group');
const Cell = require('./Cell');
const utils = require('../utils');

function Template (name) {
  this.name = name || '模板名';
  this.creator = '';
  this.createAt = new Date().valueOf();
  this.table = [];
  this._groupIndex = 0;
}

Template.prototype.insertGroup = function(group) {
  group.index = this._groupIndex;
  this._groupIndex++;

  this.table.push(group);
  return this;
}
Template.prototype.insertCell = function(cell) {
  this.table.push(cell);
  return this;
}
Template.prototype.getCells = function() {
  let list = [];
  for (let cell of this.table) {
    if(cell instanceof Cell) {
      list.push(cell)
    }else if(cell instanceof Group) {
      list = list.concat(cell.getCells());
    }else {
      throw new TypeError('unknown template type:', cell);
    }
  }

  return list;
}

Template.prototype.eval = function() {
  let cells = this.getCells();
  let data = {};
  for (let cell of cells) {
    if(cell.func === 'value') {
      let name = cell.name;
      let value = cell.value || cell.default;
      data[name] = value
    }
  }

  for (var i = 0; i < cells.length; i++) {
    let cell = cells[i];
    if(cell.func === 'expression') {
      try {
        let t = utils.parseExpression(cell.value, data);
        cells[i].value = eval(t);
      }catch (err) {
        cells[i].value = cell.default;
        console.error('数据解析错误', cell.value, err);
      }
    }
  }
  return this;
}

module.exports = Template;
