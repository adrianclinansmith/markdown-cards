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
- make tool-bar-item colors consistent 
- logo doesn't appear on iOS, it's probably too big
- for overflow cards, allow text to scroll to the top or bottom of card, but keep margins when it isn't scrolled
- on firefox, make scrollbar invisible when not in use
- maybe change refresh button to reset button
- add descriptions to the functions
- add more font sizes

# Bugs

- smooth-scroll for deck doesn't always work on Safari desktop
- when changing from multiple card file to single card file, the index label isn't updated.
- On Safari desktop, localStorage doesn't seem to work

# Features

- make markdown links open in new tab
- allow markdown images