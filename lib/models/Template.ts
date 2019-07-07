import Group from './Group';
import Cell from './Cell';
import * as utils from '../utils';
import Sandbox from 'trpg-sandbox';
const sandbox = new Sandbox();

export default class Template {
  name: string;
  creator: string;
  createAt: number;
  desc: string;
  table: any[];
  states: any[];
  _groupIndex: number;
  _stateIndex: number;
  context: {};

  constructor(name: string) {
    this.name = name || '模板名';
    this.creator = '';
    this.createAt = new Date().valueOf();
    this.desc = '';
    this.table = [];
    this.states = [];
    this._groupIndex = 0;
    this._stateIndex = 0;

    this.context = {};
  }

  insertGroup(group) {
    group.index = this._groupIndex;
    this._groupIndex++;

    this.table.push(group);
    return this;
  }

  insertCell(cell) {
    this.table.push(cell);
    return this;
  }

  getCells() {
    let list = [];
    for (let cell of this.table) {
      if (cell instanceof Cell) {
        list.push(cell);
      } else if (cell instanceof Group) {
        list = list.concat(cell.getCells());
      } else {
        throw new TypeError('unknown template type:' + cell);
      }
    }

    return list;
  }

  getCell(cellName) {
    let cells = this.getCells();
    for (let cell of cells) {
      if (cell.name === cellName) {
        return cell;
      }
    }
    return null;
  }

  removeCell(cell) {
    for (var i = 0; i < this.table.length; i++) {
      let _cell = this.table[i];
      if (_cell instanceof Cell) {
        if (_cell === cell) {
          this.table.splice(i, 1);
          break;
        }
      } else if (_cell instanceof Group) {
        _cell.removeCell(cell);
      }
    }

    return this;
  }

  insertState(state) {
    state.index = this._stateIndex;
    this._stateIndex++;

    this.states.push(state);
    return this;
  }

  getStateEffects() {
    let list = [];
    let states = JSON.parse(JSON.stringify(this.states));
    states.sort((a, b) => b.priority - a.priority);
    for (let state of states) {
      let effects = state.effects;
      effects.sort((a, b) => b.priority - a.priority);
      for (let effect of effects) {
        list.push(...effect.attributes);
      }
    }

    return list;
  }

  eval() {
    const cells = this.getCells();
    let data = {};
    for (let cell of cells) {
      let name = cell.name;
      let value = '';
      if (cell.func === 'value') {
        value = cell.value || cell.default;
        data[name] = value;
      } else if (cell.func === 'dice') {
        value = cell.value || '';
        data[name] = value;
      } else if (cell.func === 'enum') {
        value = cell.value || cell.default.split(',')[0];
        data[name] = value;
      }
    }

    for (var i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (cell.func === 'expression') {
        try {
          let cellData = Object.assign({}, data, cell.ext.parameter);
          let t = utils.parseExpression(cell.default, cellData);
          cells[i].value = sandbox.run(t, Object.assign({}, this.context));
        } catch (err) {
          cells[i].value = '数据错误';
          console.error('数据解析错误', cell.value, err);
        }
      }
    }
    return this;
  }

  evalState() {
    this.eval();
    const _e = function(str, def) {
      try {
        return sandbox.run(str, this.context);
      } catch (err) {
        console.error(err);
        return def;
      }
    };
    // 原始数据备份相互拷贝
    let cells = this.getCells();
    for (let cell of cells) {
      if (cell.originValue) {
        // 之前已经做过拷贝处理。计算前先恢复到原始数据
        cell.value = cell.originValue;
      } else {
        // 之前未进行过拷贝处理。计算前先保存原始数据备份
        cell.originValue = cell.value;
      }
    }

    // 设置效果
    const effects = this.getStateEffects();
    const appendEffects = []; // 如果是表达式类型的效果。则暂时存储，最后进行统一处理
    for (let effect of effects) {
      let cell = this.getCell(effect.name);
      if (cell) {
        if (cell.func === 'value') {
          cell.value = _e(`${cell.value}${effect.value}`, cell.value);
        } else {
          appendEffects.push(effect);
        }
      }
    }
    this.eval();

    // 处理appendEffects
    for (let effect of appendEffects) {
      let cell = this.getCell(effect.name);
      if (cell) {
        cell.value = _e(`${cell.value}${effect.value}`, cell.value);
      }
    }

    return this;
  }

  // 遍历所有dice方法的属性并生成表达式结果值
  generateRollResult() {
    const cells = this.getCells();

    for (var i = 0; i < cells.length; i++) {
      if (cells[i].func !== 'dice') continue;

      try {
        let t = utils.parseDiceExpression(cells[i].default);
        cells[i].value = sandbox.run(t, this.context);
      } catch (err) {
        cells[i].value = '数据错误';
        console.error('数据解析错误', cells[i].value, err);
      }
    }
  }

  // 未加状态时的数据
  getOriginData() {
    let cells = this.getCells();
    let data = {};
    for (let cell of cells) {
      let name = cell.name;
      let value = cell.originValue || cell.value;
      if (!value && cell.func === 'value') {
        value = cell.default;
      }
      data[name] = value;
    }
    return data;
  }

  getData() {
    let cells = this.getCells();
    let data = {};
    for (let cell of cells) {
      let name = cell.name;
      let value = cell.value;
      if (!value && cell.func === 'value') {
        value = cell.default;
      }
      data[name] = value;
    }
    return data;
  }

  setData(obj) {
    let cells = this.getCells();
    for (let cell of cells) {
      let name = cell.name;
      if (obj[name]) {
        cell.value = obj[name];
      }
    }
    return this.eval();
  }
}
