//Groq chat model integration.

//The Groq API is compatible to the OpenAI API with some limitations. View the full API ref at:

//@link
//{https://docs.api.groq.com/md/openai.oas.html}

//Setup: Install @langchain/groq and set an environment variable named GROQ_API_KEY.

//npm install @langchain/groq

//export GROQ_API_KEY="your-api-key";

//Constructor args
//Runtime args
//Runtime args can be passed as the second argument to any of the base runnable methods .invoke. .stream, .batch, etc. They can also be passed via .bind, or the second arg in .bindTools, like shown in the examples below:

// When calling `.bind`, call options should be passed via the first argument
const llmWithArgsBound = llm.bind({
stop: ["\n"],
tools: [...],
});

// When calling `.bindTools`, call options should be passed via the second argument
const llmWithTools = llm.bindTools(
[...],
{
tool_choice: "auto",
}
);

//Examples............................................................
import { ChatGroq } from '@langchain/groq';

const llm = new ChatGroq({
model: "mixtral-8x7b-32768",
temperature: 0,
// other params...
});
const input = `Translate "I love programming" into Hindi.`;

// Models also accept a list of chat messages or a formatted prompt
const result = await llm.invoke(input);
console.log(result);


AIMessage {
"content": "The French translation of \"I love programming\" is \"J'aime programmer\". In this sentence, \"J'aime\" is the first person singular conjugation of the French verb \"aimer\" which means \"to love\", and \"programmer\" is the French infinitive for \"to program\". I hope this helps! Let me know if you have any other questions.",
"additional_kwargs": {},
"response_metadata": {
"tokenUsage": {
"completionTokens": 82,
"promptTokens": 20,
"totalTokens": 102
},
"finish_reason": "stop"
},
"tool_calls": [],
"invalid_tool_calls": []
}
for await (const chunk of await llm.stream(input)) {
console.log(chunk);
}
AIMessageChunk {
"content": "",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": "The",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": " French",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": " translation",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": " of",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": " \"",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": "I",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": " love",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
...
AIMessageChunk {
"content": ".",
"additional_kwargs": {},
"response_metadata": {
"finishReason": null
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}
AIMessageChunk {
"content": "",
"additional_kwargs": {},
"response_metadata": {
"finishReason": "stop"
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}


import { AIMessageChunk } from '@langchain/core/messages';
import { concat } from '@langchain/core/utils/stream';

const stream = await llm.stream(input);
let full: AIMessageChunk | undefined;
for await (const chunk of stream) {
full = !full ? chunk : concat(full, chunk);
}
console.log(full);
AIMessageChunk {
"content": "The French translation of \"I love programming\" is \"J'aime programmer\". In this sentence, \"J'aime\" is the first person singular conjugation of the French verb \"aimer\" which means \"to love\", and \"programmer\" is the French infinitive for \"to program\". I hope this helps! Let me know if you have any other questions.",
"additional_kwargs": {},
"response_metadata": {
"finishReason": "stop"
},
"tool_calls": [],
"tool_call_chunks": [],
"invalid_tool_calls": []
}

////////////////////////////////////////////////////////////////

import { z } from 'zod';

const llmForToolCalling = new ChatGroq({
model: "llama3-groq-70b-8192-tool-use-preview",
temperature: 0,
// other params...
});

const GetWeather = {
name: "GetWeather",
description: "Get the current weather in a given location",
schema: z.object({
location: z.string().describe("The city and state, e.g. San Francisco, CA")
}),
}

const GetPopulation = {
name: "GetPopulation",
description: "Get the current population in a given location",
schema: z.object({
location: z.string().describe("The city and state, e.g. San Francisco, CA")
}),
}

const llmWithTools = llmForToolCalling.bindTools([GetWeather, GetPopulation]);
const aiMsg = await llmWithTools.invoke(
"Which city is hotter today and which is bigger: LA or NY?"
);
console.log(aiMsg.tool_calls);
[
{
name: 'GetWeather',
args: { location: 'Los Angeles, CA' },
type: 'tool_call',
id: 'call_cd34'
},
{
name: 'GetWeather',
args: { location: 'New York, NY' },
type: 'tool_call',
id: 'call_68rf'
},
{
name: 'GetPopulation',
args: { location: 'Los Angeles, CA' },
type: 'tool_call',
id: 'call_f81z'
},
{
name: 'GetPopulation',
args: { location: 'New York, NY' },
type: 'tool_call',
id: 'call_8byt'
}
]

////////////////////////////
import { z } from 'zod';

const Joke = z.object({
setup: z.string().describe("The setup of the joke"),
punchline: z.string().describe("The punchline to the joke"),
rating: z.number().optional().describe("How funny the joke is, from 1 to 10")
}).describe('Joke to tell user.');

const structuredLlm = llmForToolCalling.withStructuredOutput(Joke, { name: "Joke" });
const jokeResult = await structuredLlm.invoke("Tell me a joke about cats");
console.log(jokeResult);
{
setup: "Why don't cats play poker in the wild?",
punchline: 'Because there are too many cheetahs.'
}
//////////////////////////