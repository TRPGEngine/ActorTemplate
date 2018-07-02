const start = "{{";
const end = "}}";

exports.parseExpression = function evalExpression(template, data) {
  var pattern = new RegExp(start + "\\s*(\\S*)\\s*" + end, "gi");

  return template.replace(pattern, function(tag, token) {
    if(data[token]) {
      return data[token];
    }else {
      throw new Error('not found data in ' + tag, data);
    }
  })
}

exports.parseDiceExpression = function parseDiceExpression(template) {
  return template.replace(/(\d+)d(\d+)/gi, function (tag, num, dice) {
    let res = 0;
    for (let i = 0; i < num; i++) {
      res += rollPoint(dice)
    }
    return res;
  })
}
