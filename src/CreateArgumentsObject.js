/**
 * Arguments 对象通过调用抽象方法 CreateArgumentsObject 创建，
 * 调用时将以下参数传入：func, names, args, env, strict。
 * @param {*} func  将要执行的函数对象作为 func 参数
 * @param {*} names  将该函数的所有形参名加入一个 List 列表，作为 names 参数
 * @param {*} args 将所有传给内部方法 [[Call]] 的实际参数作为 args 参数
 * @param {*} env 将该函数代码的环境变量作为 env 参数
 * @param {*} strict 将该函数代码是否为严格代码作为strict 参数
 */
function CreateArgumentsObject(func, names, args, env, strict) {
  //令 len 为参数 args 的元素个数
  let len = args.length;
  //令 obj 为一个新建的 ECMAScript 对象
  //按照 8.12 章节中的规范去设定 obj 对象的所有内部方法
  let obj = {};
  //将 obj 对象的内部属性 [[Class]] 设置为 "Arguments"
  obj[`[[Class]]`] = 'Arguments';
  //令 Object 为标准的内置对象的构造函数 (15.2.2)
  obj.constructor = Object;
  //将 obj 对象的内部属性 [[Prototype]] 设置为标准的内置对象的原型对象
  obj[`[[Prototype]]`] = Object.prototype;
  //调用 obj 的内部方法 [[DefineOwnProperty]]，将 "length" 传递进去，属性描述符为：{[[Value]]: len, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}，参数为 false
  Object.defineProperty(obj, 'length', {
    value: len, writable: true, enumerable: false, configurable: true
  });
  let indx = len - 1;
  while (indx >= 0) {
    let val = args[indx];
    Object.defineProperty(obj, indx.toString(), { value: val, writable: true, enumerable: true, configurable: true });
    indx = indx - 1;
  }
  return obj;
}
module.exports = CreateArgumentsObject;