export default class State {
  visibility: boolean;
  name: any;
  desc: string;
  priority: number;
  effects: any[];

  constructor(name: string, desc = '', priority = 0) {
    this.visibility = true;
    this.name = name || '状态名';
    this.desc = desc;
    this.priority = priority;
    this.effects = [];
  }

  appendEffect(effect) {
    this.effects.push(effect);
    return this;
  }

  removeEffect(effect) {
    let index = this.effects.indexOf(effect);
    this.effects.splice(index, 1);
    return this;
  }
}
