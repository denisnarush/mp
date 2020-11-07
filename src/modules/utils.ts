export function toURLencoded(element, key?, list?) {
  list = list || [];
  if (typeof element == "object") {
    for (var idx in element)
      toURLencoded(element[idx], key ? key + "[" + idx + "]" : idx, list);
  } else {
    list.push(key + "=" + encodeURIComponent(element));
  }
  return list.join("&");
}

export function arrayOfObjectsDistinct(arr) {
  const result = [];
  const map = new Map();
  for (const item of arr) {
    if (!map.has(item.id)) {
      map.set(item.id, true);
      result.push(item);
    }
  }

  return result;
}
