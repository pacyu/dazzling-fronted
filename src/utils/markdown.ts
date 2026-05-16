import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      try {
        return hljs.highlight(code, { language }).value
      } catch {
        return code
      }
    },
  }),
  {
    gfm: true,
    breaks: true
  }
)

export const renderMarkdown = async (content: string): Promise<string> => {
  if (!content) return ''
  return await marked.parse(content)
}