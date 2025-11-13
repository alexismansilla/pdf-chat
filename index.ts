import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { PDFParse } from 'pdf-parse';
import OpenAI from 'openai';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: pdfBuffer });
  const result = await parser.getText();

  if (!result.pages || result.pages.length === 0) {
    return '';
  }

  return result.text.trim();
}

async function askChatGPT(question: string, pdfText: string): Promise<string> {
  const prompt = `
    Aqui tienes el contenido de un archivo PDF y debes responder la pregunta basada en el contenido del archivo PDF.
    ${pdfText}
    Pregunta: ${question}
    Respuesta:
  `;

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    console.log(response);
    return response.output_text;
  } catch (error) {
    console.error('Error al hacer la pregunta a ChatGPT:', error);
    return 'Lo siento, no pude responder la pregunta. Por favor, intenta nuevamente.';
  }
}

async function chatWithPDF(pdfPath: string) {
  const pdfText = await extractTextFromPDF(pdfPath);
  console.log('¡Hola! Soy un agente que puede responder preguntas sobre el PDF. ¿Cómo puedo ayudarte?');

  process.stdin.on('data', async (input) => {
    const question = input.toString().trim();
    if (question.toLowerCase() === 'salir') {
      console.log('¡Hasta luego!');
      process.exit(0);
    }

    const response = await askChatGPT(question, pdfText);
    console.log(response);
  });
}

chatWithPDF('./file.pdf');