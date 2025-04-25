/**
 * 函数声明
 */
class FunctionDeclaration {
  static createInstance(fn, FormalParameterList, FunctionBody, Scope) {
    //Strict 为布尔标记
    let Strict = false;
    //按照如下步骤构建函数对象
    //创建一个新的 ECMAScript 原生对象，令 F 为此对象
    let F = { name: fn };
    //依照 8.12 描述设定 F 的除 [[Get]] 以外的所有内部方法
    //设定 F 的 [[Class]] 内部属性为 "Function"。
    F[` [[Class]]`] = Function;
    //设定 F 的 [[Prototype]] 内部属性为 15.3.3.1 指定的标准内置 Function 对象的 prototype 属性
    //F.__proto__=Function.prototype
    F[`[[Prototype]]`] = Function.prototype;
    //依照 15.3.5.4 描述，设定 F 的[[Get]] 内部属性
    //依照 13.2.1 描述，设定 F 的[[Call]] 内部属性
    //依照 13.2.2 描述，设定 F 的[[Construct]] 内部属性
    //依照 15.3.5.3 描述，设定 F 的[[HasInstance]] 内部属性
    //设定 F 的[[Scope]] 内部属性为 Scope 的值
    F[`[[Scope]]`] = Scope;
    //令 names 为一个列表容器，其中元素是以从左到右的文本顺序对应 FormalParameterList 的标识符的字符串。
    let names = FormalParameterList;
    //设定 F 的 [[FormalParameters]] 内部属性为 names
    F[`[[FormalParameters]]`] = names;
    //设定 F 的 [[Code]] 内部属性为 FunctionBody
    F[`[[Code]]`] = FunctionBody;
    //设定 F 的 [[Extensible]] 内部属性为 true。
    F[`[[Extensible]]`] = true;
    //令 len 为 FormalParameterList 指定的形式参数的个数。如果没有指定参数，则令 len 为 0。
    let len = FormalParameterList.length;
    //以参数 "length"，属性描述符 {[[Value]]: len, [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}，false 调用 F 的 [[DefineOwnProperty]] 内部方法
    Object.defineProperty(F, 'length', { value: len, writable: false, enumerable: false, configurable: false });
    //令 proto 为仿佛使用 new Object() 表达式创建新对象的结果，其中 Object 是标准内置构造器名
    let proto = new Object();
    //以参数 "constructor", 属性描述符 {[[Value]]: F, { [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}, false 调用 proto 的 [[DefineOwnProperty]] 内部方法。
    Object.defineProperty(proto, 'constructor', { value: F, writable: true, enumerable: false, configurable: false });
    //以参数 "prototype", 属性描述符 {[[Value]]: proto, { [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: false}, false 调用 F 的 [[DefineOwnProperty]] 内部方法。
    //每个函数都会自动创建一个 prototype 属性，以满足函数会被当作构造器的可能性
    Object.defineProperty(F, 'prototype', { value: proto, writable: true, enumerable: false, configurable: false });
    return F;
  }
}
module.exports = FunctionDeclaration;