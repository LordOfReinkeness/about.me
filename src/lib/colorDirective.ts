import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Plugin } from 'unified';

const ALLOWED_COLORS = new Set(['green', 'red', 'yellow', 'cyan', 'gray', 'white']);

const colorDirective: Plugin<[], Root> = () => {
    return (tree: Root) => {
        visit(tree, (node: any) => {
            if (node.type !== 'textDirective' && node.type !== 'leafDirective') return;
            if (!ALLOWED_COLORS.has(node.name)) return;

            node.data ??= {};
            node.data.hName = 'span';
            node.data.hProperties = {
                style: `color: var(--${node.name})`,
            };
        });
    };
};

export default colorDirective;
