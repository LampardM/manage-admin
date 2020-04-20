/**
 * @Desc 包装页面公共属性、方法
 * @exports class
 * @Author jieq
 * @Date 2020-04-19 00:44:01
 * @LastEditors jieq
 * @LastEditTime 2020-04-19 14:47:47
 */
export default WrappedComponent => {
  class Enhance extends WrappedComponent {
    urlQuery(key) {
      if (!this.urlSearchParams)
        this.urlSearchParams = new URLSearchParams(this.props.location.search)
      return this.urlSearchParams.get(key)
    }

    // deprecated
    go(path, params) {
      this.props.history.push({
        pathname: path,
        state: params
      })
    }

    render() {
      return super.render()
    }
  }

  Enhance.displayName = WrappedComponent.displayName || WrappedComponent.name || 'Enhance'
  return Enhance
}
