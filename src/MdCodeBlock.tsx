/* 
	Sources: 
	https://github.com/react-syntax-highlighter/react-syntax-highlighter
	https://johnphung.tech/blog/adding-code-syntax-highlighting-react-markdown
*/

import { CodeComponent, CodeProps } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"

type Props = {
    language: string
    children: string
}

function MdCodeBlock({node, inline, className, children, ...props}: CodeProps) {
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

export default MdCodeBlock