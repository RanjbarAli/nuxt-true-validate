import { useRuntimeConfig } from 'nuxt/app'

export default (name, replaces = {}) => {
  const config = useRuntimeConfig()
  return Object.entries(replaces).reduce((trans, [key, value]) => trans.replace(`:${key}:`, value), config.public.trueValidate.lang[name])
}
