import { isArray, isObject, isString } from "@vue/shared";

export function normalizeClass(value: unknown): string {
    let res = '';
    if (isString(value)) {
        res = value as string;
    } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            res += normalizeClass(value[i]) + ' ';
        }
    } else if (isObject(value)) {
        for (const name in value as object) {
            if ((value as object)[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}