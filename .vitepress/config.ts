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
      }),
      {
        name: 'custom:adjust-order',
        configResolved(c) {
          movePlugin(
            // @ts-expect-error ignore readonly type
            c.plugins,
            'vitepress',
            'before',
            'unocss:transformers:pre'
          )
        }
      }
    ]
  }
})

function movePlugin(
  plugins: { name: string }[],
  pluginAName: string,
  order: 'before' | 'after',
  pluginBName: string
) {
  const pluginBIndex = plugins.findIndex((p) => p.name === pluginBName)
  if (pluginBIndex === -1) return

  const pluginAIndex = plugins.findIndex((p) => p.name === pluginAName)
  if (pluginAIndex === -1) return

  if (order === 'before' && pluginAIndex > pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0]
    plugins.splice(pluginBIndex, 0, pluginA)
  }

  if (order === 'after' && pluginAIndex < pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0]
    plugins.splice(pluginBIndex, 0, pluginA)
  }
}
