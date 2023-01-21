import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
// import "./App.css";

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
			/>
		</header>
	</div>
	);
}

export default App;
