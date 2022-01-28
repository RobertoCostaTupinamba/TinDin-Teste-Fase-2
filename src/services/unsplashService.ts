import axios from 'axios';
import PlaceModel from '../models/Place';
import { resCreatedPlace, resErro, resUpdate } from './placeService';

interface IUnsplashPayload {
  name?: string;
  userId: string;
  _id?: string;
}

export class UnsplashService {
  public async getCreateImage(payload: IUnsplashPayload): Promise<resCreatedPlace> {
    const { name, userId } = payload;
    let response: resCreatedPlace;

    if (!name) {
      response = { message: 'Nome é obrigatório', status: 404 };
      return response;
    }

    const existPlace = await PlaceModel.findOne({ userId, name });

    if (existPlace) {
      response = { message: 'Você já adicionou este lugar na lista', status: 404 };
      return response;
    }

    const key = process.env.KEY || '';

    const url = await axios
      .get(`https://api.unsplash.com/search/photos?query=${name}&client_id=${key}`)
      .then((result) => {
        const urlPhotoRegular = result.data.results[0]?.urls.regular || undefined;
        return urlPhotoRegular;
      });

    if (!url) {
      response = { message: 'Não foi possivel encontrar uma imagem com este nome, tente um outro nome', status: 404 };
      return response;
    }

    response = {
      photo: url,
    };

    return response;
  }

  public async getImageForUpdate(payload: IUnsplashPayload): Promise<resUpdate | resErro> {
    const { _id, name, userId } = payload;
    let response: resUpdate | resErro;

    const placeOld = await PlaceModel.findOne({ _id, userId }, { userId: 0, __v: 0 }).catch(() => {
      response = { message: 'id não encontrado', status: 404 };
    });

    if (!placeOld) {
      response = { message: 'id não encontrado', status: 404 };
      return response;
    }

    if (placeOld.name !== name) {
      const key = process.env.KEY || '';
      const url = await axios
        .get(`https://api.unsplash.com/search/photos?query=${name}&client_id=${key}`)
        .then((result) => {
          const urlPhotoRegular = result.data.results[0]?.urls.regular || undefined;
          return urlPhotoRegular;
        });

      if (!url) {
        response = {
          message:
            'Não foi possivel encontrar uma imagem com este nome, tente um outro nome. Seus dados não serão atualizados',
          status: 404,
        };
        return response;
      }

      response = {
        photo: url,
      };

      return response;
    }

    response = {
      message: 'Os dados não foram atualizados, pois são iguais aos armazenados no banco',
      status: 409,
    };

    return response;
  }
}
