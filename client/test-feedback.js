import axios from 'axios';

async function testFeedback() {
  try {
    const response = await axios.post('http://localhost:5000/api/feedback/submit', {
      totalScore: 50,
      aggressionLevel: 'Medium',
      feedbackText: 'Testing from node script'
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testFeedback();
