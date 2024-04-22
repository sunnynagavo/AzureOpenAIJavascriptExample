'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const openAIClient = new OpenAIClient(
    "<OpenAPIkeyEndPoint>",
    new AzureKeyCredential("<OpenAPIkey>")
);

http.createServer(async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    try {
        const chatResponse = await openAIClient.getChatCompletions(
            "TestChatbot", // deployment name
            [
                { role: "system", content: "You are a helpful, fun and friendly sales assistant for Cosmic Works, a bicycle and bicycle accessories store." },
                { role: "user", content: "Do you sell bicycles?" },
                { role: "assistant", content: "Yes, we do sell bicycles. What kind of bicycle are you looking for?" },
                { role: "user", content: "I'm not sure what I'm looking for. Could you help me decide?" }
            ]);

        for (const choice of chatResponse.choices) {
            res.end(choice.message.content);
        }
        // End the response after processing
        res.end("Chat completed.");
    } catch (err) {
        console.error(`Error: ${JSON.stringify(err, null, 2)}`);
        res.end(`An error occurred: ${JSON.stringify(err, null, 2)}`);
    }
}).listen(port);
