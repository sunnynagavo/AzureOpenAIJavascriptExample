'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

const { ComputerVisionClient } = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

const key = '74fce23676ef45b19f94ed641810ccbf';
const endpoint = 'https://testcomputervisionsunny.cognitiveservices.azure.com/';

const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new ComputerVisionClient(credentials, endpoint);

http.createServer(async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Hello World\n');

    // Define the URL of the image you want to analyze
    const imageUrl = 'https://sunnyteststorageaccount.blob.core.windows.net/startup/FruitsAndVeggiePicture.jfif?sp=r&st=2024-04-20T01:15:48Z&se=2024-04-20T09:15:48Z&spr=https&sv=2022-11-02&sr=b&sig=EwNHdDQV8Twb1GMPBnIZp0oxwh6uj4Y%2BzVbqiDmyoOg%3D';

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

