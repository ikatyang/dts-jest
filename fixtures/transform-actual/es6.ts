import * as path from 'path';

// @dts-jest
['path/to/abc.ts'].map(x => path.basename(x)); //=> ['abc.ts']
