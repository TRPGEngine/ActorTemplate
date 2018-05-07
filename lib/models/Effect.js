function Effect(name, attributes, priority = 0) {
  this.name = name || '效果名';
  this.attributes = attributes;
  this.priority = priority;
}

module.exports = Effect;
