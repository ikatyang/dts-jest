import * as _ts from 'typescript';

export const get_diagnostic_message = (diagnostic: _ts.Diagnostic) =>
  // istanbul ignore next
  typeof diagnostic.messageText === 'string'
    ? diagnostic.messageText
    : diagnostic.messageText.messageText;
