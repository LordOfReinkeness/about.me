import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import colorDirective from '../lib/colorDirective';

// Defined at module scope to avoid re-creating on every render
const remarkPlugins = [remarkDirective, colorDirective];

type Props = {
    content: string;
};

export function MdOutput({ content }: Props) {
    return (
        <ReactMarkdown
            remarkPlugins={remarkPlugins}
            components={{
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
