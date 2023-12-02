# Packages

```bash
$ npx create-react-app markdown-cards --template typescript
$ npm install react-markdown
$ npm install remark-gfm
$ npm install remark-math
$ npm install rehype-katex
$ npm install react-syntax-highlighter
$ npm install @types/react-syntax-highlighter
$ npm install @mui/material @emotion/react @emotion/styled
```

# KaTex

To render KaTex properly import this stylesheet:

```javascript
import "katex/dist/katex.min.css"; 
```

Here's a link for settings and troubleshooting:

https://katex.org/docs/issues.html 

# Aesthetic  

- Keep default markdown up to date
- make toolbar and toolbar-items' sizes more dynamic
- add descriptions to the functions
- add more font sizes
- change font for font-size-picker and card-index-display

# Bugs

- smooth-scroll for deck doesn't always work on Safari desktop
- when changing from multiple card file to single card file, the index label isn't updated.

# Features

- turn into Progressive Web App (PWA)
- allow markdown images
- enhance katex line-breaks
- allow user to create markdown files

# Links

- [understanding dependencies in useEffect](https://blog.bitsrc.io/understanding-dependencies-in-useeffect-7afd4df37c96)
- [lang tags for chinese and pinyin](https://sites.psu.edu/symbolcodes/languages/asia/chinese/)