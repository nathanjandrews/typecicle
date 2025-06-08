import { z } from "zod";
import type { StandardSchemaV1 } from "./standard-schema";
import type { Prettify } from "./util";

function command<
	TOptions extends CommandOptionsMap,
	TPositionalName extends string | undefined,
	TPositionalValidator extends StandardSchemaV1,
>(args: {
	options?: TOptions;
	positional?: PositionalArgument<TPositionalName, TPositionalValidator>;
	handler: Handler<
		TOptions,
		TPositionalName,
		StandardSchemaV1.InferOutput<TPositionalValidator>
	>;
}) {}

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

command({
	options: {
		route: {
			validator: z.enum(["53", "66"]),
		},
	},
	positional: {
		name: "foo",
		validator: z.object({
			bar: z.boolean(),
		}),
	},
	handler: ({ foo, options }) => {
		foo.bar;
	},
});
