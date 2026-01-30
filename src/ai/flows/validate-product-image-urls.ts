'use server';

/**
 * @fileOverview A flow to validate product image URLs using an AI-powered tool.
 *
 * - validateProductImageUrls - A function that validates a list of product image URLs.
 * - ValidateProductImageUrlsInput - The input type for the validateProductImageUrls function.
 * - ValidateProductImageUrlsOutput - The return type for the validateProductImageUrls function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateProductImageUrlsInputSchema = z.array(
  z.object({
    id: z.string().describe('The ID of the product.'),
    imageUrl: z.string().describe('The URL of the product image.'),
  })
).describe('An array of product image URLs to validate.');

export type ValidateProductImageUrlsInput = z.infer<
  typeof ValidateProductImageUrlsInputSchema
>;

const ValidateProductImageUrlsOutputSchema = z.array(
  z.object({
    id: z.string().describe('The ID of the product.'),
    isValid: z.boolean().describe('Whether the image URL is valid or not.'),
    reason: z.string().optional().describe('The reason why the image URL is invalid, if applicable.'),
  })
).describe('An array of validation results for each product image URL.');

export type ValidateProductImageUrlsOutput = z.infer<
  typeof ValidateProductImageUrlsOutputSchema
>;

export async function validateProductImageUrls(
  input: ValidateProductImageUrlsInput
): Promise<ValidateProductImageUrlsOutput> {
  return validateProductImageUrlsFlow(input);
}

const checkImageUrl = ai.defineTool({
  name: 'checkImageUrl',
  description: 'Checks if an image URL is valid and returns whether it is valid or not and the reason why if applicable.',
  inputSchema: z.string().describe('The image URL to check.'),
  outputSchema: z.object({
    isValid: z.boolean().describe('Whether the image URL is valid.'),
    reason: z.string().optional().describe('The reason why the image URL is invalid, if applicable.'),
  }),
}, async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, {method: 'HEAD'});
      if (!response.ok) {
        return {
          isValid: false,
          reason: `Image URL returned an error code: ${response.status}`,
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        return {
          isValid: false,
          reason: `Image URL does not point to an image. Content type: ${contentType}`,
        };
      }

      return {isValid: true};
    } catch (error: any) {
      return {
        isValid: false,
        reason: `Error checking image URL: ${error.message}`,
      };
    }
  });

const validateProductImageUrlsPrompt = ai.definePrompt({
  name: 'validateProductImageUrlsPrompt',
  tools: [checkImageUrl],
  input: {schema: ValidateProductImageUrlsInputSchema},
  output: {schema: ValidateProductImageUrlsOutputSchema},
  prompt: `For each product image URL in the input, use the checkImageUrl tool to validate the URL.

Return an array of objects, where each object contains the product ID, a boolean indicating whether the URL is valid, and a reason if the URL is invalid.

Input: {{{JSON.stringify input}}}
`,
});

const validateProductImageUrlsFlow = ai.defineFlow(
  {
    name: 'validateProductImageUrlsFlow',
    inputSchema: ValidateProductImageUrlsInputSchema,
    outputSchema: ValidateProductImageUrlsOutputSchema,
  },
  async input => {
    const {output} = await validateProductImageUrlsPrompt(input);
    return output || [];
  }
);
