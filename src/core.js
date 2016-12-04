// JavaScript 标准库 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects
if (typeof module !== 'object') { module = {} }
module.exports = (function () {
  const JSutils = function (dom, selector) {
    let len = 0
    for (let i = 0; i < dom.length; i++) {
      if (!dom[i]) {
        continue
      }
      this[i] = dom[i]
      len++
    }

    this[Symbol.iterator] = function* () {
      for (let i = 0; i < len; i++) {
        yield this[i]
      }
    }

    this.length = len
    this.selector = selector
    this.$ = $
  }

  const $ = (selector, context) => {
    selector = selector || ''
    context = context || window.document
    return new JSutils(!$.isElement(selector) ? context.querySelectorAll(selector) : [selector], selector)
  }
  $.version = '0.0.1'

  $.fn = {
    constructor: JSutils,
    addClass () {
      console.log('im here', this)
    },
    has (parent, dom) {
      if (dom === parent) {
        return true
      } else if (dom.parentNode !== undefined) {
        return this.contains(dom.parentNode, parent)
      }
      return false
    },
    on (eventType, handler) {
      for (let node of this) {
        node.addEventListener(eventType, handler)
      }
      return this
    },
    un (eventType, handler) {
      for (let node of this) {
        node.removeEventListener(eventType, handler)
      }
      return this
    }
  }

  $.statics = {
    contains (container, contained) {
      if (!contained || !container) {
        return false
      } else if (contained === container) {
        return true
      } else if (contained.parentNode) {
        return this.contains(container, contained.parentNode)
      }
      return false
    },
    isElement (obj) {
      try {
        return obj instanceof window.HTMLElement || obj === window.document
      } catch (e) {
        return (typeof obj === 'object') &&
          (obj.nodeType === 1) && (typeof obj.style === 'object') &&
          (typeof obj.ownerDocument === 'object')
      }
    },
    install (Vue) {
        //针对 VUE 的安装
        Object.defineProperty(Vue.prototype, '$', {
            get () { return $ }
        })
    }
  }
  Object.assign($, $.statics)
  JSutils.prototype = $.fn
  window && (window.JSutils = $)
  window && window.$ === undefined && (window.$ = window.JSutils)
  return $
})()