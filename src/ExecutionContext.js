/**
 * 执行上下文
 * see http://es5.github.io/#x10.3
 */
class ExecutionContext {
  /**
   * @param {*} lexicalEnvironment 词法环境
   * @param {*} thisBinding this 绑定
   */
  constructor(lexicalEnvironment, thisBinding) {
    this.variableEnvironment = this.lexicalEnvironment = lexicalEnvironment;
    this.thisBinding = thisBinding;
  }
}
module.exports = ExecutionContext;