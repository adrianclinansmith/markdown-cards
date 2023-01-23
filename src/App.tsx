/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import MdCodeBlock from "./MdCodeBlock";

import 'katex/dist/katex.min.css'

const mdString = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |

math: $a^2 = \\sqrt{b^2 + c^2}$

C code:  
\`\`\`c
int myInt = 12;
\`\`\`
`;

function App() {
	return (
	<div className="App">
		<header className="App-header">
			<ReactMarkdown 
				children={mdString}
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex]}
				components={{
					code({inline, className, children, style, ...props}) {
					  const match = /language-(\w+)/.exec(className || '')
					  return !inline && match ? (
						<SyntaxHighlighter
						  children={String(children).replace(/\n$/, '')}
						  style={vscDarkPlus}
						  language={match[1]}
						  PreTag="div"
						  {...props}
						/>
					  ) : (
						<code className={className} {...props}>
						  {children}
						</code>
					  )
					}
				  }}
			/>
		</header>
	</div>
	);
}

export default App;
