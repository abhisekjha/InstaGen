// Import TensorFlow.js
import * as tf from '@tensorflow/tfjs';

// Add a message to the chat box
function addMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.innerText = `${sender}: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load the TensorFlow.js model
async function loadModel() {
    try {
        const model = await tf.loadGraphModel('https://storage.googleapis.com/tfjs-models/savedmodel/universal-sentence-encoder/model.json');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        return null;
    }
}

// Generate a response using the model
async function generateResponse(input) {
    const model = await loadModel();
    if (!model) {
        addMessage('Chatbot', 'Model could not be loaded. Please try again later.');
        return;
    }
    try {
        const processedInput = tf.tensor([input]);
        const responseTensor = model.predict(processedInput);
        const responseArray = await responseTensor.data();
        const response = responseArray[0] || 'No response generated';
        addMessage('Chatbot', response);
    } catch (error) {
        console.error('Error generating response:', error);
        addMessage('Chatbot', 'An error occurred while generating the response.');
    }
}

// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', async function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addMessage('User', userInput);
        await generateResponse(userInput);
        document.getElementById('user-input').value = '';
    }
});
