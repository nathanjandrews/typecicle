import { err } from "neverthrow";
import type { StandardSchemaV1 } from "./standard-schema";
import { type Prettify, RESERVED_OPTION_NAMES } from "./util";

type PositionalArgument<
	TPositionalName extends string | undefined,
	TPositionalValidator extends StandardSchemaV1,
> = {
	name: TPositionalName;
	validator: TPositionalValidator;
};

export type CommandOption = {
	alias?: string[];
	validator: StandardSchemaV1;
};

type CommandOptionsMap = Record<string, CommandOption>;

type Handler<
	TOptions extends CommandOptionsMap,
	TPositionalName extends string | undefined,
	TValue,
> = (
	args: Prettify<
		OptionsHandlerArgument<TOptions> &
			PositionalHandlerArgument<TPositionalName, TValue>
	>,
) => void;

type OptionsHandlerArgument<TOptions extends CommandOptionsMap> =
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{} extends TOptions
		? // biome-ignore lint/complexity/noBannedTypes: <explanation>
			{}
		: // Otherwise, include the 'options' field
			{
				options: {
					[key in keyof TOptions]: Prettify<
						StandardSchemaV1.InferOutput<TOptions[key]["validator"]>
					>;
				};
			};

type PositionalHandlerArgument<
	TPositionalName extends string | undefined,
	TValue,
> = TPositionalName extends undefined
	? // biome-ignore lint/complexity/noBannedTypes: <explanation>
		{}
	: Prettify<{ [key in Exclude<TPositionalName, undefined>]: TValue }>;

export function command<
	TOptions extends CommandOptionsMap,
	TPositionalName extends string | undefined,
	TPositionalValidator extends StandardSchemaV1,
>(args: {
	name: string;
	options?: TOptions;
	positional?: PositionalArgument<TPositionalName, TPositionalValidator>;
	handler: Handler<
		TOptions,
		TPositionalName,
		StandardSchemaV1.InferOutput<TPositionalValidator>
	>;
}) {
	const options = Object.entries(args.options ?? {}).map(([key, value]) => ({
		key,
		value,
	}));

	for (const option of options) {
		if (RESERVED_OPTION_NAMES.includes(option.key)) {
			return err({
				command: args.name,
				type,
			});
		}
	}
}
