import { Request, Response } from "express";
import OpenAI from "openai";



export async function AskGPT(req: Request, res: Response) {
  try {
    const prompt = req.body.prompt;
    const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return res.json(chatCompletion.choices);
  } catch (error) {
    return res.status(400).send(error);
  }
}
