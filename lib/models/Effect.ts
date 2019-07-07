export default class Effect {
  name: any;
  attributes: any;
  priority: number;

  constructor(name, attributes, priority = 0) {
    this.name = name || '效果名';
    this.attributes = attributes;
    this.priority = priority;
  }
}
