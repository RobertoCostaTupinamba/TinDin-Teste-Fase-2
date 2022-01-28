import express, { Response, Request } from 'express';

import UserController from '../controllers/User/userController';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const controller = new UserController();
  const response = await controller.login(req.body);

  if (response.status) {
    return res.status(response.status).json({ message: response.message });
  }

  return res.json(response);
});

export default router;
