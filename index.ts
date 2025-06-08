import { z } from "zod/v4";

console.log("Hello via Bun!");

const b = 12;

let a = 13;

const echoCommand = command({
	name: "",
	options: {
		route: {
			aliases: "z",
			description: "",
			parser: z.literal(["foo", "bar", "baz"]),
		},
	},
	args: z.enum(["1", "2"]).array(),
	handler: (opts, args) => {
		console.log(args);
	},
});

run([echoCommand], {
	with: {
		version: true,
		help: true,
	},
});
