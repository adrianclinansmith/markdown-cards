/* 
	Sources: 
	https://github.com/react-syntax-highlighter/react-syntax-highlighter
	https://johnphung.tech/blog/adding-code-syntax-highlighting-react-markdown
*/

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism"

type Props = {
    language: string
    children: string
}

function MdCodeBlock({ language, children }: Props) {
    return (
        <SyntaxHighlighter
            children={children}
            language={language}
			showLineNumbers={true}
            style={materialDark}
            wrapLines={true}
        />
    )
}

export default MdCodeBlock