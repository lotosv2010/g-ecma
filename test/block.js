/**
var a = 1;
function one(c) {
  var b = 2;
  console.log(a, b, c, e);
  let d = 4;
  {
    let d = 5;
    var e = 6;
    let f = 7
    console.log(a, b, c, d, e, f);
  }
}
one(3);
*/
const LexicalEnvironment = require('../src/LexicalEnvironment');
const ExecutionContext = require('../src/ExecutionContext');
const ECStack = require('../src/ECStack');
const FunctionDeclaration = require('../src/FunctionDeclaration');
const CreateArgumentsObject = require('../src/CreateArgumentsObject');

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
console.log(env.GetBindingValue('a'));//undefined

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
  console.log(a, b, c, e);
  let d = 4;
  {
    let d = 5;
    var e = 6;
    console.log(a, b, c, d, e);
  }
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
    Object.defineProperty(go, fn, { value: undefined, writable: true, enumerable: true, configurable: configurableBindings });
    if (!existingProp.writable) {
      throw new Error(`TypeError`);
    }
  }
}
env.SetMutableBinding(fn, fo, strict);

// 6.执行代码
// 给a赋值为1
env.SetMutableBinding('a', 1);
console.log(env.GetBindingValue('a'));// 1

// 7.编译函数
//进入函数代码
//当控制流根据一个函数对象 F、调用者提供的 thisArg 以及调用者提供的 argumentList，进入 函数代码 的执行环境时，执行以下步骤：
let thisArg = global;
let argumentList = [3];
//以 F 的 [[Scope]] 内部属性为参数调用 NewDeclarativeEnvironment，并令 localEnv 为调用的结果
let localEnv = LexicalEnvironment.NewDeclarativeEnvironment(fo[`[[Scope]]`]);
//设词法环境为 localEnv 设变量环境为 localEnv
let oneExecutionContext = new ExecutionContext(localEnv, thisArg);
ECStack.push(oneExecutionContext);
//按 [10.5](#10.5) 描述的方案，使用 函数代码 code 和 argumentList 执行定义绑定初始化步骤
env = ECStack.current.lexicalEnvironment.environmentRecord;
configurableBindings = false;
strict = false;
//令 func 为通过 [[Call]] 内部属性初始化 code 的执行的函数对象
let func = fo;
//令 code 为 F 的 [[Code]] 内部属性的值。
let code = func[`[[Code]]`];
//令 names 为 func 的 [[FormalParameters]] 内部属性。
names = func[`[[FormalParameters]]`];
let args = [3];
//令 argCount 为 args 中元素的数量
let argCount = args.length;
let n = 0;
names.forEach(argName => {
  n += 1;
  let v = n > argCount ? undefined : args[n - 1];
  //以 argName 为参数，调用 env 的 HasBinding 具体方法，并令 argAlreadyDeclared 为调用的结果。
  argAlreadyDeclared = env.HasBinding(argName);
  if (!argAlreadyDeclared) {
    env.CreateMutableBinding(argName);
  }
  env.SetMutableBinding(argName, v, strict);
});
let argumentsAlreadyDeclared = env.HasBinding('arguments');
if (!argumentsAlreadyDeclared) {
  let argsObj = CreateArgumentsObject(func, names, args, env, strict);
  env.CreateMutableBinding('arguments');
  env.SetMutableBinding('arguments', argsObj);
}

dn = 'b';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}


dn = 'e';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}

// 8.编译块级作用域
localEnv = LexicalEnvironment.NewDeclarativeEnvironment(ECStack.current.variableEnvironment);
env = localEnv.environmentRecord;
dn = 'd';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}
ECStack.current.lexicalEnvironment = localEnv;

// 9.执行函数
//开始执行one
ECStack.current.variableEnvironment.environmentRecord.SetMutableBinding('b', 2);
console.log(
  'a=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'a').name,
  'b=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'b').name,
  'c=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'c').name,
  'e=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'e').name,
  //LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'f')
);
ECStack.current.lexicalEnvironment.environmentRecord.SetMutableBinding('d', 4);

// 10.编译块级作用域
localEnv = LexicalEnvironment.NewDeclarativeEnvironment(ECStack.current.variableEnvironment);
ECStack.current.lexicalEnvironment = localEnv;
env = localEnv.environmentRecord;
dn = 'd';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}

dn = 'f';
//以 dn 为参数，调用 env 的 HasBinding 具体方法，并令 varAlreadyDeclared 为调用的结果
varAlreadyDeclared = env.HasBinding(dn);
//如果 varAlreadyDeclared 为 false，则：
if (!varAlreadyDeclared) {
  //以 dn 和 configurableBindings 为参数，调用 env 的 CreateMutableBinding 具体方法。
  env.CreateMutableBinding(dn, configurableBindings);
  //以 dn、undefined 和 strict 为参数，调用 env 的 SetMutableBinding 具体方法。
  env.SetMutableBinding(dn, undefined, strict);
}

// 11.执行块级作用域
ECStack.current.lexicalEnvironment.environmentRecord.SetMutableBinding('d', 5);
ECStack.current.variableEnvironment.environmentRecord.SetMutableBinding('e', 6);
ECStack.current.lexicalEnvironment.environmentRecord.SetMutableBinding('f', 7);
console.log(
  'a=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'a').name,
  'b=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'b').name,
  'c=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'c').name,
  'd=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'd').name,
  'e=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'e').name,
  'f=' + LexicalEnvironment.GetIdentifierReference(ECStack.current.lexicalEnvironment, 'f').name
);