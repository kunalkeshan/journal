import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  includeIgnoreFile(gitignorePath),
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
];

export default eslintConfig;