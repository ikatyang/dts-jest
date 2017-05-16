// tslint:disable

module.exports = function (snapshot, kind) {
  return (kind === 'error')
    ? 'Error -> ' + snapshot
    : 'Type -> ' + snapshot;
};
