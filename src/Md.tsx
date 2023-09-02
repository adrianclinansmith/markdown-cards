import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CodeProps } from "react-markdown/lib/ast-to-react";

interface Props {
	children: string;
}

export default function Md({ children }: Props) {
	return (
		<ReactMarkdown
			className="react-markdown"
			components={{ code: MdCodeBlock }}
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeKatex]}
		>
			{children}
		</ReactMarkdown>
	);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Helper Components
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function MdCodeBlock({node, inline, className, children, style, ...props}: 
CodeProps) {
    const match = /language-(\w+)/.exec(className || "");
	if (inline || !match) {
		return <code children={children} className={className} {...props}/>
	}
	return (
		<SyntaxHighlighter
			children={String(children).replace(/\n$/, "")}
			codeTagProps={{}} // Prevents unwanted background color
			customStyle={{"background": "transparent"}}
			language={match[1]}
			PreTag="div"
			style={oneLight}
			wrapLongLines={true}
			{...props}
		/>
	) 
}