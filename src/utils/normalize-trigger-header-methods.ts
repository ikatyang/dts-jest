import {
  GroupMethod,
  TestMethod,
  TriggerGroup,
  TriggerHeader,
} from '../definitions';

export const normalize_trigger_header_methods = (headers: TriggerHeader[]) => {
  const has_only_method = headers.some(
    header =>
      header.method === TestMethod.Only ||
      (header.group !== undefined && header.group.method === GroupMethod.Only),
  );

  if (!has_only_method) {
    return;
  }

  headers.forEach(header => {
    if (
      header.method === TestMethod.Test &&
      (header.group === undefined || header.group.method === GroupMethod.Test)
    ) {
      header.method = TestMethod.Skip;
    }
  });

  const group_map = new Map<undefined | TriggerGroup, TriggerHeader[]>();
  headers.forEach(header => {
    set_array_map(group_map, header.group, header);
  });
  group_map.forEach((grouped_triggers, group) => {
    if (group !== undefined) {
      normalize_grouped_trigger_methods(grouped_triggers);
    }
  });

  headers.forEach(header => {
    if (header.method === TestMethod.Only) {
      header.method = TestMethod.Test;
    }
  });
};

function set_array_map<T, U>(map: Map<T, U[]>, key: T, value: U) {
  const values = map.get(key);
  if (values === undefined) {
    map.set(key, [value]);
  } else {
    values.push(value);
  }
}

function normalize_grouped_trigger_methods(headers: TriggerHeader[]) {
  const test_headers: TriggerHeader[] = [];
  const only_headers: TriggerHeader[] = [];

  const is_skip_group = headers[0].group!.method === GroupMethod.Skip;

  headers.forEach(header => {
    if (header.method === TestMethod.Test) {
      test_headers.push(header);
    } else if (header.method === TestMethod.Only) {
      only_headers.push(header);
    }
  });

  if (is_skip_group || only_headers.length !== 0) {
    test_headers.forEach(header => (header.method = TestMethod.Skip));
  }
}
