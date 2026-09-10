
const axios = require("axios");
const judge0Url = (process.env.JUDGE0_URL || "https://ce.judge0.com").replace(/\/$/, "");

const getLangaugeById = (lang) => {
    const language = {
        "c++": 54,
        "java": 62,
        "javascript": 63,
    };
    return language[lang.toLowerCase()];
};

const submitBatch = async(submissions) => {
    const options = {
        method: 'POST',
        url: `${judge0Url}/submissions/batch`,
        params: {
            base64_encoded: 'false'
        },
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Error submitting batch to Judge0:", error.message || error);
        // It's good practice to rethrow or handle the error appropriately
        throw new Error("Failed to submit batch to Judge0.");
    }
};

// --- CORRECTED WAITING FUNCTION ---
const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};
// --- END CORRECTION ---

const submittoken = async(resultoken) => {
    const options = {
        method: 'GET',
        url: `${judge0Url}/submissions/batch`,
        params: {
            tokens: resultoken.join(","),
            base64_encoded: 'false',
            fields: '*'
        },
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    };

    for (let attempt = 0; attempt < 30; attempt += 1) {
        try {
            const response = await axios.request(options);
            const submissions = response.data.submissions;

            // Judge0 returns 'submissions' as an array directly in the response data for batch GET
            // Make sure `response.data` has a `submissions` array.
            if (!submissions || !Array.isArray(submissions)) {
                console.error("Unexpected response structure from Judge0 GET tokens:", response.data);
                throw new Error("Invalid Judge0 response for token status check.");
            }

            // Status ID 1 = In Queue, 2 = Processing. We want to wait for anything > 2
            const areAllResultsObtained = submissions.every((r) => r.status_id > 2);

            if (areAllResultsObtained) {
                return submissions;
            }

            await waiting(1000);
        } catch (error) {
            console.error("Error fetching submission tokens from Judge0:", error.message || error);
            throw new Error("Failed to retrieve submission results from Judge0.");
        }
    }

    throw new Error("Judge0 timed out while executing the submission.");
};

module.exports = { getLangaugeById, submitBatch, submittoken };
