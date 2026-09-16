import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/types';

function isNamedFromClause(node: TSESTree.Node): node is TSESTree.ExportNamedDeclaration & { source?: TSESTree.Literal } {
  return (
    node.type === 'ExportNamedDeclaration' &&
    node.source !== null &&
    node.source.type === 'Literal'
  );
}

const rule = ESLintUtils.RuleCreator(
  () =>
    `https://example.com/rules/no-barrel-re-exports`
)({
  name: 'no-barrel-re-exports',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow re-exporting from barrel files (index.ts). Always forbid export * from.',
    },
    schema: [],
    messages: {
      starExport:
        'Use explicit named exports instead of `export * from`.',
      namedFromBarrel:
        'Do not re-export from a barrel file (index.ts). Import from the actual module instead.',
    },
  },
  create(context) {
    function reportStarExport(node: TSESTree.ExportNamedDeclaration) {
      context.report({
        node,
        messageId: 'starExport',
      });
    }

    function reportNamedFromBarrel(node: TSESTree.ExportNamedDeclaration) {
      context.report({
        node,
        messageId: 'namedFromBarrel',
      });
    }

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration & { source?: TSESTree.Literal }) {
        // Only care about re-exports (those with a `from` clause)
        if (node.source === null) {
          return;
        }

        const sourceValue = node.source.value as string;

        if (node.specifiers.length === 0) {
          // No specifiers + has `from` → `export * from '...'`, `export type * from '...'`, etc.
          reportStarExport(node);
          return;
        }

        // 2. Forbid named re-exports from barrel files (index.ts, ...)
        // Only evaluate if source looks like it resolves to a local barrel file.
        // We check the literal path for `/index.` or trailing `/index`
        if (
          typeof sourceValue === 'string' &&
          isNamedFromClause(node)
        ) {
          // Check if the source path itself looks like a barrel file
          // This is a heuristic — it checks the string as written.
          // Cases: './index', '../index', './components/foo/index', etc.
          const isBarrelSource =
            /\/index\.[a-zA-Z]{1,5}$/.test(sourceValue) ||
            /\/index$/.test(sourceValue);

          if (isBarrelSource) {
            reportNamedFromBarrel(node);
          }
        }
      },
    };
  },
});

export const noBarrelReExports = {
  plugins: {
    local: {
      rules: {
        'no-barrel-re-exports': rule,
      },
    },
  },
  rules: {
    'local/no-barrel-re-exports': 'error',
  },
};

export default noBarrelReExports;
