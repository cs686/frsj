import { assert, assertEquals } from "$std/testing/asserts.ts";
import { describe, it } from "$std/testing/bdd.ts"

import { handleMessage } from './chatbot.ts' 

Deno.test("chatbot", async () => {
  const message = "Hello, World!";
  await handleMessage(message);
});
