const start = "{{";
const end = "}}";

exports.parseExpression = function evalExpression(template, data) {
  var pattern = new RegExp(start + "\\s*(\\S*)\\s*" + end, "gi");

  return template.replace(pattern, function(tag, token) {
    if(data[token]) {
      return data[token];
    }else {
      throw new Error(' not found data in ' + tag, data);
    }
  })
}
