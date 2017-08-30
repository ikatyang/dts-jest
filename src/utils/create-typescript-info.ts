export const create_typescript_info = (
  version: string,
  path: string,
  title_case = true,
) => `${title_case ? 'U' : 'u'}sing TypeScript v${version} from ${path}`;
