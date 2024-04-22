'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const key = '<subscription Key>';
const endpoint = '<computervision endpoint>';

const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new ComputerVisionClient(credentials, endpoint);

http.createServer(async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n');

    // Define the URL of the image you want to analyze
    const imageUrl = '<imageUrl>';

    // Call the function to analyze the image
    const result = await analyzeImage(imageUrl, { visualFeatures: ['Objects'] });

    // Assuming 'result' is the response from the analyzeImage call
    if (result.objects && result.objects.length > 0) {
        const fruitsAndVeggies = result.objects.filter(obj => obj.object.toLowerCase().includes('fruit') || obj.object.toLowerCase().includes('vegetable'));
        console.log("Detected fruits and vegetables:", fruitsAndVeggies);
    } else {
        console.log("No fruits or vegetables detected.");
    }

    // Send the analysis result as the response
    res.end(`Image Analysis Result:\n${JSON.stringify(result, null, 2)}`);
}).listen(port);

async function analyzeImage(url) {
    try {
        const result = await client.analyzeImage(url, { visualFeatures: ['Categories', 'Description', 'Objects'] });
        console.log("Image analysis result:", result);
        return result;
    } catch (error) {
        console.error("An error occurred while analyzing the image:", error);
        return error;
    }
}

