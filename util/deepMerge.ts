export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// A generic recursive deep merge function.
// It will merge the source object into the target object,
// recursing into any properties that are objects.
export const deepMerge = (target: any, source: any): any => {
    // If either target or source is not an object, return source.
    if (typeof target !== "object" || target === null) return source;
    if (typeof source !== "object" || source === null) return source;

    // Use the same type (array/object) for output.
    const output = Array.isArray(target) ? [...target] : { ...target };

    Object.keys(source).forEach((key) => {
        const targetValue = target[key];
        const sourceValue = source[key];

        // If both the target and source values are objects, merge them recursively.
        if (
            typeof targetValue === "object" &&
            targetValue !== null &&
            typeof sourceValue === "object" &&
            sourceValue !== null
        ) {
            output[key] = deepMerge(targetValue, sourceValue);
        } else {
            // Otherwise, simply override with the source value.
            output[key] = sourceValue;
        }
    });

    return output;
};
