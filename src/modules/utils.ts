export function toURLencoded (element, key?, list?) {
    list = list || [];
    if (typeof(element) == "object") {
        for (var idx in element)
            toURLencoded(element[idx], key ? key + "[" + idx + "]" : idx, list);
    } else {
        list.push(key + "=" + encodeURIComponent(element));
    }
    return list.join("&");
}