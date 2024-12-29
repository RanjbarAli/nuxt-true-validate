import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'
import * as lang from './languages'

let langOption = lang.en

export default defineNuxtModule({
  meta: {
    name: 'nuxt-true-validate',
    configKey: 'trueValidate',
  },
  setup(options, nuxt) {
    if (typeof options?.lang == 'object') langOption = options.lang
    else if (typeof options?.lang == 'string') langOption = lang[options.lang]
    nuxt.options.runtimeConfig.public.trueValidate = {
      lang: langOption,
    }

    const resolver = createResolver(import.meta.url)
    const validation = resolver.resolve('./runtime/validation')

    addImports({
      name: 'TrueForm',
      as: 'TrueForm',
      from: validation,
    })

    addImports({
      name: 'TrueField',
      as: 'TrueField',
      from: validation,
    })
  },
})
