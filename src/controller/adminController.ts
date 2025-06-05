import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const createTopicWithSteps = async (req: Request, res: Response) => {
  try {
    const { title, description, steps } = req.body;
    if (!title || !description || !steps) {
      return res.render('admin-topic', { error: 'Preencha todos os campos.' });
    }
    
    const topic = await prisma.topic.create({
      data: { title, description }
    });
    
    const stepsArr = Array.isArray(steps) ? steps : Object.values(steps);
    for (let idx = 0; idx < stepsArr.length; idx++) {
      const step = stepsArr[idx];
      await prisma.step.create({
        data: {
          title: step.title,
          content: step.content,
          order: idx + 1,
          topicId: topic.id
        }
      });
    }
    res.redirect('/admin/topics');
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    res.render('admin-topic', { error: 'Erro ao criar tópico.' });
  }
};