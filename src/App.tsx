/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Input from '@mui/material/Input';
import MdCodeBlock from "./MdCodeBlock";

import 'katex/dist/katex.min.css'
import Button from "@mui/material/Button";
import { ChangeEvent, Dispatch, useState } from "react";

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

function readFile(e: ChangeEvent<HTMLInputElement>, setString: Dispatch<React.SetStateAction<string>>) {
	if (e.target.files == null) {
		setString("");
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		setString(typeof reader.result === "string" ? reader.result : "");
	};
	reader.readAsText(e.target.files[0]);
}

function App() {
	const [markdown, setMarkdown] = useState("");
	return (
		<div className="App">
			<Button variant="contained" component="label">
				Upload
				<input hidden type="file" onChange={e => readFile(e, setMarkdown)} />
			</Button>
			<ReactMarkdown 
				children={markdown}
				components={{code: MdCodeBlock}}
				rehypePlugins={[rehypeKatex]}
				remarkPlugins={[remarkGfm, remarkMath]}
			/>
		</div>
	);
}

export default App;
