export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export const RESERVED_OPTION_NAMES = Object.freeze(["true", "false"]);
