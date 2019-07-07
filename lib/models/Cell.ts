export default class Cell {
  visibility: boolean;
  name: string;
  desc: string;
  default: string;
  func: string;
  type: string;
  value: string;
  ext: {};
  constructor(name: string) {
    this.visibility = true;
    this.name = name || '数据名';
    this.desc = '';
    this.default = ''; // 默认值, 若为expression则是表达式, 若为enum则是用逗号分隔的数组(如: str1,str2,str3)ss
    this.func = 'value'; //value or expression or enum
    this.type = 'text'; // string
    this.value = '';
    this.ext = {}; // 额外参数
    // 允许的额外参数
    // parameter: [{name, value}]
  }

  setVisibility(val) {
    if (!!val) {
      this.visibility = val;
      return this;
    } else {
      return this.visibility;
    }
  }

  setDefault(val) {
    if (!!val) {
      this.default = val;
      return this;
    } else {
      return this.default;
    }
  }

  setFunc(val) {
    if (!!val) {
      if (['value', 'expression', 'enum', 'dice'].indexOf(val) === -1) {
        val = 'value';
      }
      this.func = val;
      return this;
    } else {
      return this.func;
    }
  }

  setType(val) {
    if (!!val) {
      if (['text', 'number', 'textarea'].indexOf(val) === -1) {
        val = 'text';
      }
      this.type = val;
      return this;
    } else {
      return this.type;
    }
  }

  setValue(val) {
    if (!!val) {
      if (this.func === 'enum') {
        // 限制输入值必须在枚举列表中
        var items = this.getEnumItems();
        if (items.indexOf(val) === -1) {
          val = items[0];
        }
      }
      this.value = val;
      return this;
    } else {
      return this.value;
    }
  }

  getEnumItems() {
    if (this.func === 'enum') {
      return this.default.split(',');
    }
  }

  clone() {
    var newObj = new Cell(this.name);
    newObj.visibility = this.visibility;
    newObj.name = this.name;
    newObj.desc = this.desc;
    newObj.default = this.default;
    newObj.func = this.func;
    newObj.type = this.type;
    newObj.value = this.value;
    newObj.ext = this.ext;

    return newObj;
  }
}
