import express, { Response, Request } from 'express';
import { UnsplashService } from '../services/unsplashService';
import { PlaceService, resErro } from '../services/placeService';
import PlaceController from '../controllers/Places/placeController';

const router = express.Router();

const placeService = new PlaceService();
const unsplashService = new UnsplashService();
// Instanciando controller com suas dependencias
const controller = new PlaceController(placeService, unsplashService);

router.post('/', async (req: Request, res: Response) => {
  const response = await controller.create({ ...req.body, userId: res.locals.id });

  if (response.status) {
    return res.status(response.status).json({ message: response.message });
  }

  return res.json(response);
});

router.get('/', async (req: Request, res: Response) => {
  const response = await controller.getAllPlaces({ ...req.query, userId: res.locals.id });

  if ((response as resErro).status) {
    return res.status((response as resErro).status).json({ message: (response as resErro).message });
  }

  return res.json(response);
});

router.get('/:_id', async (req: Request, res: Response) => {
  const response = await controller.getById({ ...req.params, userId: res.locals.id });

  if ((response as resErro).status) {
    return res.status((response as resErro).status).json({ message: (response as resErro).message });
  }

  return res.json(response);
});

router.put('/', async (req: Request, res: Response) => {
  const response = await controller.updatePlace({ ...req.body, userId: res.locals.id });

  if ((response as resErro).status) {
    return res.status((response as resErro).status).json({ message: (response as resErro).message });
  }

  return res.json(response);
});

router.delete('/:_id', async (req: Request, res: Response) => {
  const response = await controller.deletePlace({ ...req.params, userId: res.locals.id });

  if ((response as resErro).status) {
    return res.status((response as resErro).status).json({ message: (response as resErro).message });
  }

  return res.json(response);
});

export default router;
