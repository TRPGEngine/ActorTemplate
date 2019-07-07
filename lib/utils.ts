const start = '{{';
const end = '}}';

export function evalExpression(template, data) {
  var pattern = new RegExp(start + '\\s*?(\\S+?)\\s*?' + end, 'gi');

  return template.replace(pattern, function(tag, token) {
    if (data[token]) {
      return data[token];
    } else {
      throw new Error('not found data in ' + tag + ':\n' + data);
    }
  });
}
export const parseExpression = evalExpression; // alias

export function parseDiceExpression(template) {
  return template.replace(/(\d+)d(\d+)/gi, function(tag, num, dice) {
    let res = 0;
    for (let i = 0; i < num; i++) {
      res += rollPoint(dice);
    }
    return res;
  });
}

function rollPoint(maxPoint: any, minPoint: any = 1) {
  maxPoint = parseInt(maxPoint);
  minPoint = parseInt(minPoint);
  if (maxPoint <= 1) {
    maxPoint = 100;
  }
  if (maxPoint < minPoint) {
    maxPoint = minPoint + 1;
  }

  var range = maxPoint - minPoint + 1;
  var rand = Math.random();
  return minPoint + Math.floor(rand * range);
}
