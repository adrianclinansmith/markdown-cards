/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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
| c | d |

math: $a^2 = \\sqrt{b^2 + c^2}$
$$
a^2 = \\sqrt{b^2 + c^2}
$$  

$$
\\sqrt{\\frac{a}{b}}
$$

C code:  
\`\`\`c
int myInt = 12;
\`\`\`
Java code:  
\`\`\`java
String s = new String();
\`\`\`
`;

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<ReactMarkdown 
					children={mdString}
					components={{code: MdCodeBlock}}
					rehypePlugins={[rehypeKatex]}
					remarkPlugins={[remarkGfm, remarkMath]}
				/>
			</header>
		</div>
	);
}

export default App;
