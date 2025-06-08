import { z } from "zod/v4";
import { command } from "./src/command";

const echoCommand = command({
	positional: {
		name: "args",
		validator: z.string(),
	},
	handler: ({ args }) => {
		console.log(args);
	},
});

run([echoCommand], {
	with: {
		version: true,
		help: true,
	},
});
