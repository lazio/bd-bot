const OpenAI = require('openai');
const config = require('../config/config');

class OpenAIService {
    constructor() {
        if (!config.openai.apiKey) {
            throw new Error('OpenAI API key is required');
        }
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey
        });
    }

    async generateGreeting(person) {
        try {
            if (!person || !person.summary) {
                throw new Error('Invalid person data');
            }

            const response = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: [
                    {
                        role: "system",
                        content: config.openai.systemPrompt
                    },
                    {
                        role: "user",
                        content: config.openai.userPrompt.replace('${name}', person.summary)
                    }
                ],
                max_tokens: config.openai.maxTokens,
                temperature: config.openai.temperature,
            });

            if (!response.choices || !response.choices[0]?.message?.content) {
                throw new Error('Invalid API response');
            }

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating AI greeting:', error);
            throw error;
        }
    }
}

// Export both the class and an instance
module.exports = {
    OpenAIService,
    instance: new OpenAIService()
}; 