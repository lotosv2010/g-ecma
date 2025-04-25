/**
 * 执行上下文栈
 */
class ECStack {
  constructor() {
    // 执行上下文栈
    this.contexts = [];
  }
  /**
   * 添加一个执行上下文
   * @param {*} EC 执行上下文
   */
  push(EC) {
    this.contexts.push(EC);
  }
  /**
   * 获取当前执行上下文
   */
  get current() {
    return this.contexts[this.contexts.length - 1];
  }
  /**
   * 删除当前执行上下文
   */
  pop() {
    this.contexts.pop();
  }
}
module.exports = new ECStack();