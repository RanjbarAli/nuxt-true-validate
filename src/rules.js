import trans from './trans'

export const required = (a) => {
  return {
    status: a instanceof File || (typeof a == 'boolean' ? !!a : a.length),
    message: trans('required'),
  }
}
export const email = (a) => {
  return {
    status: a.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})$/),
    message: trans('email'),
  }
}
export const url = (a) => {
  return {
    status: a.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/),
    message: trans('url'),
  }
}
export const phone = (a) => {
  return {
    status: a.match(/^\+?[1-9]\d{0,14}$/),
    message: trans('phone'),
  }
}
export const min = (a, min) => {
  return {
    status: a.length >= Number(min),
    message: trans('min', { min }),
  }
}

export const max = (a, max) => {
  return {
    status: a.length <= Number(max),
    message: trans('max', { max }),
  }
}
export const length = (a, len) => {
  return {
    status: a.length == Number(len),
    message: trans('length', { len }),
  }
}
export const regex = (a, regex) => {
  return {
    status: a.match(new RegExp(regex)),
    message: trans('regex'),
  }
}
export const _same = (a, sameWith, otherProps) => {
  return {
    status: a == otherProps[sameWith].data.value,
    message: trans('same', { same: otherProps[sameWith].name }),
  }
}
export const starts = (a, str) => {
  return {
    status: a.startsWith(str),
    message: trans('starts', { str }),
  }
}
export const ends = (a, str) => {
  return {
    status: a.endsWith(str),
    message: trans('ends', { str }),
  }
}
export const integer = (a) => {
  return {
    status: a.match(/^\d+$/),
    message: trans('integer'),
  }
}
export const exists = (a, ...args) => {
  args.length--
  return {
    status: args.includes(a),
    message: trans('exists', { exists: args.join(',') }),
  }
}
export const not_exists = (a, ...args) => {
  args.length--
  return {
    status: !args.includes(a),
    message: trans('not_exists', { exists: args.join(',') }),
  }
}
export const extensions = (a, ...args) => {
  args.length--
  return {
    status: args.includes(a?.name.split('.').pop().toLowerCase()),
    message: trans('extensions', { extensions: args.join(',') }),
  }
}
export const mimes = (a, ...args) => {
  args.length--
  return {
    status: args.includes(a?.type),
    message: trans('mimes', { mimes: args.join(',') }),
  }
}
export const file = (a) => {
  return {
    status: a instanceof File,
    message: trans('file'),
  }
}
export const image = (a) => {
  return {
    status: a instanceof File && ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'].includes(a.type),
    message: trans('image'),
  }
}
export const size = (a, operator, ...args) => {
  args.length--
  let result
  const size = a?.size / 1024
  const numArgs = args.map(Number)
  switch (operator) {
    case '=':
      result = size === numArgs[0]
      break
    case '!=':
      result = size !== numArgs[0]
      break
    case '>':
      result = size > numArgs[0]
      break
    case '>=':
      result = size >= numArgs[0]
      break
    case '<':
      result = size < numArgs[0]
      break
    case '<=':
      result = size <= numArgs[0]
      break
    case 'between':
      result = size >= numArgs[0] && size <= numArgs[1]
      break
  }
  return {
    status: result,
    message: trans('size', { operator, args: numArgs.map(a => a + 'KB').join(', ') }),
  }
}
export const type = (a, b) => {
  return {
    status: typeof a == b,
    message: trans('type', { type: b }),
  }
}
export const is_true = (a) => {
  return {
    status: !!a,
    message: trans('is_true'),
  }
}
export const is_false = (a) => {
  return {
    status: !a,
    message: trans('is_false'),
  }
}
