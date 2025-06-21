// This file contains the Genkit flow for generating adaptive messages (taunts or rewards) from the Procrastinemon, based on the user's goal completion.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveMessageInputSchema = z.object({
  goalsCompleted: z.number().describe('The number of goals the user completed today.'),
  totalGoals: z.number().describe('The total number of goals the user set for today.'),
});
export type AdaptiveMessageInput = z.infer<typeof AdaptiveMessageInputSchema>;

const AdaptiveMessageOutputSchema = z.object({
  message: z.string().describe('The adaptive message from the Procrastinemon.'),
});
export type AdaptiveMessageOutput = z.infer<typeof AdaptiveMessageOutputSchema>;

export async function getAdaptiveMessage(input: AdaptiveMessageInput): Promise<AdaptiveMessageOutput> {
  return adaptiveMessageFlow(input);
}

const adaptiveMessagePrompt = ai.definePrompt({
  name: 'adaptiveMessagePrompt',
  input: {schema: AdaptiveMessageInputSchema},
  output: {schema: AdaptiveMessageOutputSchema},
  prompt: `You are the Procrastinemon, a demon that either taunts or rewards the user based on their productivity today.

  The user set {{totalGoals}} goals for today, and completed {{goalsCompleted}} of them.

  If the user completed all their goals, provide an encouraging message.
  If the user completed none of their goals, provide a funny taunting message to try and motivate them.
  If the user completed some but not all of their goals, provide a neutral message that encourages them to do better tomorrow.

  Keep the message short and engaging, and under 50 words.
  `,
});

const adaptiveMessageFlow = ai.defineFlow(
  {
    name: 'adaptiveMessageFlow',
    inputSchema: AdaptiveMessageInputSchema,
    outputSchema: AdaptiveMessageOutputSchema,
  },
  async input => {
    const {output} = await adaptiveMessagePrompt(input);
    return output!;
  }
);
