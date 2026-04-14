/**
 * NEXUS AUTOMATION ENGINE — OpenAI Client
 * Centralized, limit-aware OpenAI API wrapper.
 */

import OpenAI from 'openai';
import * as LimitAwareAgent from '../agents/limit-aware-agent.js';
import Logger from '../memory/logger.js';

let client = null;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set.');
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/**
 * Generate a chat completion from OpenAI.
 * @param {string} prompt - The user prompt
 * @param {number} maxTokens - Max tokens for completion
 * @param {string} model - Optional model override
 * @returns {Promise<string>} - The response text
 */
export async function generateCompletion(prompt, maxTokens = 1000, model = null) {
  if (LimitAwareAgent.isThrottled()) {
    throw new Error('System throttled by Limit-Aware Agent. Request blocked.');
  }

  const resolvedModel = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const resolvedMaxTokens = Math.min(maxTokens, parseInt(process.env.MAX_TOKENS_PER_REQUEST || '2000'));

  try {
    const openai = getClient();

    const response = await openai.chat.completions.create({
      model: resolvedModel,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for the Nexus Automation Engine — a faceless, minimalist AI productivity brand. Always respond with valid JSON when instructed to do so. Be direct, precise, and minimal.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: resolvedMaxTokens,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '';
    const tokensUsed = response.usage?.total_tokens || 0;

    // Track usage
    LimitAwareAgent.trackRequest(tokensUsed);

    return text;
  } catch (err) {
    Logger.error('OPENAI_CLIENT', err.message);
    throw err;
  }
}

/**
 * Generate a structured JSON response, with retry on parse failure.
 */
export async function generateStructured(prompt, maxTokens = 1000, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const text = await generateCompletion(prompt, maxTokens);
      // Strip markdown code fences if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      if (i === retries) throw new Error(`Failed to get structured response after ${retries + 1} attempts: ${err.message}`);
      // Small delay before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
