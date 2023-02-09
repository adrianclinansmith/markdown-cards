/* 
	Sources: 
	https://github.com/react-syntax-highlighter/react-syntax-highlighter
	https://johnphung.tech/blog/adding-code-syntax-highlighting-react-markdown
*/

import { CodeProps } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

function MdCodeBlock({node, inline, className, children, style, ...props}: CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
	if (inline || !match) {
		return <code children={children} className={className} {...props}/>
	}
	return (
		<SyntaxHighlighter
			children={String(children).replace(/\n$/, "")}
			language={match[1]}
			PreTag="div"
			style={vscDarkPlus}
			{...props}
		/>
	) 
}

export default MdCodeBlock