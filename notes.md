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

# Issues / To-dos

- Bookmark the last opened file in the upload button
- Save font-size in Window.localStorage (adjust font-size-picker accordingly)
- make toolbar and toolbar-items' sizes more dynamic
- Keep default markdown up to date
- stop buttons from flashing bounding-box when clicked
