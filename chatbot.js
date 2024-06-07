// Import TensorFlow.js
import * as tf from '@tensorflow/tfjs';

// Function to add a message to the chat box
function addMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.innerText = `${sender}: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to load the TensorFlow.js model
async function loadModel() {
    const model = await tf.loadGraphModel('https://storage.googleapis.com/tfjs-models/savedmodel/universal-sentence-encoder/model.json');
    return model;
}

// Function to generate a response using the loaded model
async function generateResponse(input) {
    const model = await loadModel();
    const processedInput = tf.tensor([input]); // Dummy processing step
    const responseTensor = model.predict(processedInput);
    const response = responseTensor.dataSync()[0]; // Convert tensor to readable response
    addMessage('Chatbot', response);
}

// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addMessage('User', userInput);
        generateResponse(userInput);
        document.getElementById('user-input').value = '';
    }
});
