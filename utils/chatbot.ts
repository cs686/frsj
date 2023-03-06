import _ from "npm:lodash@^4.17.21"
import { ChatGPTAPI, ChatMessage } from "npm:chatgpt@5.0.6"

// const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
const OPENAI_API_KEY = ""
logWithTime(OPENAI_API_KEY)

if (!OPENAI_API_KEY) {
    logWithTime("⛔️ OPENAI_API_KEY must be set")
    Deno.exit(1)
}

let conversationID: string | undefined
let parentMessageID: string | undefined

// Start ChatGPT API
let chatGPTAPI: ChatGPTAPI
try {
    chatGPTAPI = new ChatGPTAPI({apiKey: OPENAI_API_KEY})
} catch (err) {
    logWithTime("⛔️ ChatGPT API error:", err.message)
    Deno.exit(1)
}
logWithTime("🔮 ChatGPT API has started...")

export async function handleMessage(message: string) {
    // Send message to ChatGPT
    try {
        const response: ChatMessage = await chatGPTAPI.sendMessage(message, {
            messageId: conversationID,
            parentMessageId: parentMessageID,
            onProgress: _.throttle(async (_partialResponse: ChatMessage) => {
            }, 4000, { leading: true, trailing: false }),
        })
        // Update conversationID and parentMessageID
        conversationID = response.conversationId
        parentMessageID = response.id
        logWithTime("📨 Response:", response)
    } catch (err) {
        logWithTime("⛔️ ChatGPT API error:", err.message)
        // If the error contains session token has expired, then get a new session token
        if (err.message.includes("session token may have expired")) {
            logWithTime("🔑 Token has expired, please update the token.")
        } else {
            logWithTime("🤖 Sorry, I'm having trouble connecting to the server, please try again later.")
        }
    }
}

// deno-lint-ignore no-explicit-any
function logWithTime(... args: any[]) {
    console.log(new Date().toLocaleString(), ...args)
  }