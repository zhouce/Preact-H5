//去掉两边的空格
export function trimBoth(str) {
	return str.replace(/^\s+|\s+$/g, "");
}