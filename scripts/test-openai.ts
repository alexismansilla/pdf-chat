import 'dotenv/config';
import { OpenAI } from 'openai';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set. Update your .env file.');
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: 'ping',
    });

    console.log('OpenAI connection OK');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('OpenAI test failed');
    console.error(error);
    process.exit(1);
  }
}

main();

