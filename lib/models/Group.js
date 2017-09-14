const Cell = require('./Cell');

let Group = function(name) {
  this.visibility = true;
  this.name = name || '默认组';
  this.index = 0;
  this.pos = 0;
  this.list = [];
}

Group.prototype.insertCell = function(cell) {
  this.list.push(cell);
  return this;
}
Group.prototype.getCells = function() {
  let list = [];
  for (let cell of this.list) {
    if(cell instanceof Cell) {
      list.push(cell)
    }else if(cell instanceof Group) {
      list.concat(cell.getCells());
    }else {
      throw new TypeError('unknown template type:', cell);
    }
  }

  return list;
}

module.exports = Group;
