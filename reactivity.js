/* eslint-disable space-before-function-paren */
/*
 * @Author: Mr-Nobody-li
 * @Date: 2023-03
 * @LastEditors: Mr-Nobody-li
 * @LastEditTime: 2023-03
 * @Description:
 */

// 这里面用到的一些map set的关系类似这样
// WeakMap(targetMap)
// ├─ Map Obj1
// │  ├─ Set Obj1.key1
// │  │  ├─ ReactiveEffectA
// │  │  └─ ReactiveEffectB
// │  ├─ Set Obj1.key2
// │  └─ Set Obj1.key3
// ├─ Map Obj2
// └─ Map Obj3

const targetMap = new WeakMap()
let activeEffect = null

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    // 最终目的收集effect
    dep.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  // 最终目的执行effect
  if (dep) {
    dep.forEach((eff) => {
      eff()
    })
  }
}

// vue3 reactive api
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      // 在触发 set 的时候进行触发依赖
      trigger(target, key)
      return result
    },
  }
  return new Proxy(target, handler)
}

// vue3 ref api
function ref(raw) {
  class RefImpl {
    get value() {
      // 收集依赖
      track(this, 'value')
      return raw
    }

    set value(newValue) {
      // 当新的值不等于老的值的话，
      // 那么才需要触发依赖
      if (newValue !== raw) {
        raw = newValue
        // 触发依赖
        trigger(this, 'value')
      }
    }
  }
  return new RefImpl()
}

// demo
const product = reactive({ price: 1, quantity: 2 })
const halfPrice = ref(0)
let total = 0

effect(() => {
  total = product.price * product.quantity
})
effect(() => {
  halfPrice.value = product.price * 0.5
})

console.log(total, halfPrice.value)

product.price = 3

console.log(total, halfPrice.value)
