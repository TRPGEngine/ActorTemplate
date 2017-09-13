let Group = function() {
  this.visibility = true;
  this.name = '默认组';
  this.index = 0;
  this.pos = 0;
  this.list = [];
}

Group.prototype.insertCell = function(cell) {
  this.list.push(cell);
  return this;
}

module.exports = Group;
