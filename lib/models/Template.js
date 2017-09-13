function Template () {
  this.name = '模板名';
  this.creator = '';
  this.createAt = '';
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

module.exports = Template;
