function State(name, desc = '', priority = 0) {
  this.visibility = true;
  this.name = name || '状态名';
  this.desc = desc;
  this.priority = priority;
  this.effects = [];
}

State.prototype.appendEffect = function(effect) {
  this.effects.push(effect);
  return this;
}

State.prototype.removeEffect = function(effect) {
  let index = this.effects.indexOf(effect);
  this.effects.splice(index, 1);
  return this;
}

module.exports = State;
