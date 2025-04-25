/**
var a = 1;
function one(c) {
    var b = 2;
    console.log(a, b,c);
}
one();
*/
const LexicalEnvironment = require('../src/LexicalEnvironment');
const ExecutionContext = require('../src/ExecutionContext');
const ECStack = require('../src/ECStack');
const FunctionDeclaration = require('../src/FunctionDeclaration');

// 1.将变量环境设置为全局环境 
const globalLexicalEnvironment = LexicalEnvironment.NewObjectEnvironment(global, null);
// 2.将词法环境设置为 全局环境
const globalEC = new ExecutionContext(globalLexicalEnvironment, global);
// 3.将全局环境压入执行环境栈中
ECStack.push(globalEC);

// 4.准备执行代码，注册全局变量
//令 env 为当前运行的执行环境的环境变量的 环境记录
let env = ECStack.current.lexicalEnvironment.environmentRecord;
//如果 code 是 eval 代码 ，则令 configurableBindings 为 true，否则令 configurableBindings 为 false。
let configurableBindings = false;
//如果代码是 严格模式下的代码 ，则令 strict 为 true，否则令 strict 为 false。
let strict = false;
//按源码顺序遍历 code，对于每一个 VariableDeclaration 和 VariableDeclarationNoIn 表达式：
//令 dn 为 d 中的标识符。
let dn = 'a';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
let varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}
console.log(env.GetBindingValue('a')); // undefined

// 5.准备执行代码，注册全局函数
//按源码顺序遍历 code，对于每一个 FunctionDeclaration 表达式 f：
//令 fn 为 FunctionDeclaration 表达式 f 中的 标识符
let fn = 'one';
//创建函数对象
//指定 FormalParameterList 为可选参数列表
let FormalParameterList = ['c'];
//指定 FunctionBody 为函数体
let FunctionBody = `
    var b = 2;
    console.log(a, b);
`;
//指定 Scope 为 词法环境
let Scope = ECStack.current.lexicalEnvironment;
//按 第 13 章 中所述的步骤初始化 FunctionDeclaration 表达式 ，并令 fo 为初始化的结果。
let fo = FunctionDeclaration.createInstance(fn, FormalParameterList, FunctionBody, Scope);
//以 fn 为参数，调用 env 的 HasBinding 具体方法，并令 argAlreadyDeclared 为调用的结果。
let argAlreadyDeclared = env.HasBinding(fn);
if (!argAlreadyDeclared) {
  env.CreateMutableBinding(fn, configurableBindings);
} else {
  //否则如果 env 是全局环境的 环境记录 对象，则
  //令 go 为全局对象。
  let go = global;
  //以 fn 为参数，调用 go 和 [[GetProperty]] 内部方法，并令 existingProp 为调用的结果。
  let existingProp = Object.getOwnPropertyDescriptor(go, fn);
  if (existingProp.configurable) {
    Object.defineProperty(go, fn, { value: undefined, writable: true, enumerable: true, configurable: +configurableBindings });
    if (!existingProp.writable) {
      throw new Error(`TypeError`);
    }
  }
}
env.SetMutableBinding(fn, fo, strict);
console.log(env.GetBindingValue('one'));