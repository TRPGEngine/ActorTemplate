import Cell from './Cell';

export default class Group {
  visibility: boolean;
  name: string;
  desc: string;
  index: number;
  pos: number;
  list: any[];
  _groupIndex: number;

  constructor(name: string) {
    this.visibility = true;
    this.name = name || '默认组';
    this.desc = '';
    this.index = 0;
    this.pos = 0;
    this.list = [];
    this._groupIndex = 0;
  }

  insertCell(cell) {
    this.list.push(cell);
    return this;
  }

  insertGroup(group) {
    group.index = this._groupIndex;
    this._groupIndex++;

    this.list.push(group);
    return this;
  }

  getCells() {
    let list = [];
    for (let cell of this.list) {
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

  removeCell(cell) {
    for (var i = 0; i < this.list.length; i++) {
      let _cell = this.list[i];
      if (_cell instanceof Cell) {
        if (_cell === cell) {
          this.list.splice(i, 1);
          break;
        }
      } else if (_cell instanceof Group) {
        _cell.removeCell(cell);
      }
    }

    return this;
  }
}
