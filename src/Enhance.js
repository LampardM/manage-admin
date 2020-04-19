/**
 * @Desc 包装页面公共属性、方法
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 00:44:01
 * @LastEditors jieq
 * @LastEditTime 2020-04-19 00:46:28
 */

const Enhance = WrappedComponent => {
  class Enhance extends WrappedComponent {
    go(path, params) {
      this.props.history.push({
        pathname: path,
        state: params
      })
    }
  }

  Enhance.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Enhance'
  return Enhance
}

export default Enhance
