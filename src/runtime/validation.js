import { ref, reactive, watch, computed } from 'vue'
import trans from '../trans'
import * as ruleHelpers from '../rules'

export const TrueForm = (properties = {}) => {
  if (typeof properties !== 'object') {
    throw new TypeError(trans('properties-must-object'))
  }

  const propertiesRef = {}

  let props = Object.entries(properties).map(([key, property]) => {
    if (typeof property !== 'object') {
      throw new TypeError(trans('properties-must-object'))
    }
    property.name ??= key
    propertiesRef[key] = {
      data: ref(property.default),
      name: property.name,
      rules: resolveRules(property?.rules, property.name),
    }
    const prop = reactive({
      name: property.name,
      data: propertiesRef[key].data,
      default: property.default,
      error: '',
      isDirty: false,
      isValid: false,
      set: (newData) => {
        if (typeof newData != 'undefined') prop.data = propertiesRef[key].data.value = newData
        const otherProps = Object.fromEntries(Object.entries(propertiesRef).filter(([k]) => k != key).map(([key, { data, name }]) => [key, { data, name }]))
        const validator = validateEach(property?.each, newData ?? propertiesRef[key].data.value, prop.name, propertiesRef[key].rules, otherProps)
        prop.error = validator || ''
        prop.isDirty = true
        prop.isValid = validator == null
      },
    })
    return [key, prop]
  })

  props = props.map(([key, prop]) => {
    const watchers = [propertiesRef[key].data]
    Object.entries(propertiesRef[key].rules).forEach(([name, params]) => {
      if (name.startsWith('_')) watchers.push(propertiesRef[params[0]].data)
    })
    watch(watchers, () => prop.set(), { deep: true })
    return [key, prop]
  })

  return reactive({
    ...Object.fromEntries(props),
    isValid: computed(() => props.every(([, value]) => value.isValid)),
    errors: computed(() => props.flatMap(([, value]) => value?.error || [])),
    isDirty: computed(() => props.some(([, value]) => value.isDirty)),
  })
}

export const TrueField = (property = {}) => {
  if (typeof property !== 'object') {
    throw new TypeError(trans('properties-must-object'))
  }
  const resolvedRules = resolveRules(property?.rules, property.name)
  const data = ref(property.default)
  const prop = reactive({
    name: property.name,
    data,
    default: property.default,
    error: '',
    isDirty: false,
    isValid: false,
    set: (newData) => {
      if (typeof newData != 'undefined') prop.data = data.value = newData
      const validator = validateEach(property?.each, newData ?? data.value, property.name, resolvedRules)
      prop.error = validator || ''
      prop.isDirty = true
      prop.isValid = validator == null
    },
  })
  watch(data, () => prop.set(), { deep: true })

  return prop
}

export const validateEach = (isList, data, name, rules, otherProps) => {
  let validator
  if (isList && (Array.isArray(data) || data instanceof FileList)) {
    for (const val of data) {
      validator = validate(name, val, rules, otherProps)
      if (typeof validator == 'string' && validator.length) break
    }
  }
  else {
    validator = validate(name, data, rules, otherProps)
  }
  return validator
}

export const resolveRules = (rules, name) => {
  if (!['object', 'string'].includes(typeof rules)) {
    throw new TypeError(trans('invalid-rules', { name }))
  }
  const parseRule = (rule) => {
    const [key, value] = rule.split(':')
    return { [key]: value ? value.split(',') : [] }
  }
  if (typeof rules === 'string') {
    rules = rules.split('|').reduce((acc, rule) => ({ ...acc, ...parseRule(rule) }), {})
  }
  else if (Array.isArray(rules)) {
    let customCount = 0
    rules = rules.reduce((acc, rule) => {
      if (typeof rule === 'function') {
        acc[`custom_${++customCount}`] = rule
      }
      else {
        Object.assign(acc, parseRule(rule))
      }
      return acc
    }, {})
  }
  return rules
}

export const validate = (name, value, rules = {}, otherProps = {}) => {
  if (rules?.unload && value == '') return ''
  delete rules.unload

  for (const rule of Object.keys(rules)) {
    const pipeline = (typeof rules[rule] === 'function')
      ? rules[rule](value, otherProps)
      : ruleHelpers[rule](value, ...(rules[rule]), otherProps)

    if (!pipeline.status) {
      return pipeline.message.replace(':attribute:', name)
    }
  }
  return null
}
