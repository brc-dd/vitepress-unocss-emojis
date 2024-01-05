import { icons } from '@iconify-json/octicon'
import { presetIcons, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

const defs = Object.fromEntries(
  Object.entries(icons.icons).map(([key]) => {
    return [key, '']
  })
)

const shortcuts = Object.fromEntries(
  Object.entries(icons.aliases || {}).map(([key, value]) => {
    return [key, value.parent]
  })
)

export default defineConfig({
  markdown: {
    emoji: { defs, shortcuts },
    config(md) {
      md.renderer.rules.emoji = (token, idx) => {
        return `<span class="i-octicon-${token[idx].markup}"></span>`
      }
    }
  },
  vite: {
    plugins: [
      UnoCSS({
        presets: [
          presetUno(),
          presetIcons({
            extraProperties: {
              display: 'inline-block',
              'vertical-align': 'middle'
            }
          })
        ]
      })
    ]
  }
})
