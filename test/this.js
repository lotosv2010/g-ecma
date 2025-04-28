//console.log(obj.getName());
//令 ref 为解释执行 MemberExpression 的结果
var name = 1;
var obj = {
  name: 2,
  getName: function () {
    return this.name;
  }
}
console.log(obj.getName());
/*
console.log((obj.getName)());
console.log((obj.getName = obj.getName)());
console.log((true && obj.getName)());
console.log((obj.getName, obj.getName)());
console.log((true && obj.getName)()); 
*/

const Reference = require('../src/Reference');

let ref = new Reference(obj, 'getName', false);
//let ref = obj.getName;
//令 func 为 GetValue(ref).
let func = Reference.GetValue(ref);
//令 argList 为解释执行 Arguments 的结果 , 产生参数值们的内部列表 (see 11.2.4).
let argList = [];
//如果 Type(func) is not Object ，抛出一个 TypeError 异常 .
/* if (!Type(func)) {
    throw new Error(`TypeError`);
} */
//如果 IsCallable(func) is false ，抛出一个 TypeError 异常 .
/* if (!IsCallable(func)) {
    throw new Error(`TypeError`);
} */
//如果 Type(ref) 为 Reference，那么 如果 IsPropertyReference(ref) 为 true，
//那么 令 thisValue 为 GetBase(ref).
//否则, ref 的基值是一个环境记录项 令 thisValue 为调用 GetBase(ref) 的 ImplicitThisValue 具体方法的结果
let thisValue;
if (Reference.Type(ref)) {
  if (Reference.IsPropertyReference(ref)) {
    thisValue = Reference.GetBase(ref);
  } else {
    thisValue = Reference.GetBase(ref).ImplicitThisValue();
  }
} else {
  //否则 , 假如 Type(ref) 不是 Reference. 令 thisValue 为 undefined.
  thisValue = undefined;
}
//返回调用 func 的 [[Call]] 内置方法的结果 , 传入 thisValue 作为 this 值和列表 argList 作为参数列表
let result = func.call(thisValue, ...argList);
console.log(result);