import MarkdownIt from 'markdown-it'
import mdAnchor from 'markdown-it-anchor'
import mdLinkAttrs from 'markdown-it-link-attributes'

const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typography: true
})
  .use(require('markdown-it-video'))
  .use(mdAnchor)
  .use(mdLinkAttrs, {
    pattern: /^https?:.+/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })

export default markdown
