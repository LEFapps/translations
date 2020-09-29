import MarkdownIt from 'markdown-it'
import mdAnchor from 'markdown-it-anchor'

const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typography: true
})
  .use(require('markdown-it-video'))
  .use(mdAnchor)

export default markdown
