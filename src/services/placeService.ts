import { Types } from 'mongoose';

import PlaceModel, { IPlace } from '../models/Place';

export interface IPlacePayload {
  photo?: string;
  userId: string;
  name?: string;
  search?: string;
  order?: string;
  page?: number;
  limit?: number;
  _id?: string;
}

export type resCreatedPlace = {
  _id?: Types.ObjectId;
  name?: string;
  photo?: string;
  message?: string;
  status?: number;
};

export type resErro = {
  message: string;
  status: number;
};

export type resGetById = {
  _id?: Types.ObjectId;
  name?: string;
  photo?: string;
};

export type resUpdate = {
  _id?: Types.ObjectId;
  name?: string;
  photo?: string;
};

export type resDelete = {
  _id?: Types.ObjectId;
  name?: string;
  photo?: string;
};

type tplotOptions = {
  [key: string]: string | number;
};

export class PlaceService {
  public async createPlace(payload: IPlacePayload): Promise<resCreatedPlace> {
    const { name, userId, photo } = payload;
    let response: resCreatedPlace;

    if (!name) {
      response = { message: 'Nome é obrigatório', status: 404 };
      return response;
    }

    const createdPlace = await new PlaceModel({ userId, name, photo }).save();

    if (!createdPlace) {
      response = { message: 'Não foi possivel criar este lugar', status: 500 };
      return response;
    }

    response = {
      _id: createdPlace._id,
      name: createdPlace.name,
      photo: createdPlace.photo,
    };

    return response;
  }

  public async getAllPlaces(payload: IPlacePayload): Promise<Array<IPlace> | resErro> {
    const { userId, search, order, page, limit } = payload;
    let response: Array<IPlace> | resErro;

    const filterOrder: tplotOptions = {};

    if (order) {
      filterOrder[order] = -1;
    }

    const places = await PlaceModel.find({ name: { $regex: search || '' }, userId }, { userId: 0, __v: 0 })
      .sort({ ...filterOrder })
      .skip(page && page > 0 ? (page - 1) * (limit || 50) : 0)
      .limit(limit || 50);

    if (places) {
      response = [...places];
      return response;
    }

    response = {
      message: 'Houve um erro',
      status: 400,
    };

    return response;
  }

  public async getById(payload: IPlacePayload): Promise<resGetById | resErro> {
    const { _id, userId } = payload;

    let response: resGetById | resErro;

    const place = await PlaceModel.findOne({ _id, userId }, { userId: 0, __v: 0 }).catch(() => {
      response = { message: 'Id não encontrado', status: 404 };
    });

    if (!place) {
      response = { message: 'Id não encontrado', status: 404 };
      return response;
    }

    response = {
      _id: place?._id,
      name: place?.name,
      photo: place?.photo,
    };

    return response;
  }

  public async updatePlace(payload: IPlacePayload): Promise<resUpdate | resErro> {
    const { _id, userId, name, photo } = payload;
    let response: resUpdate | resErro;

    const updatedPlace = await PlaceModel.findOneAndUpdate(
      { _id, userId },
      { name, photo },
      {
        new: true,
        __v: 0,
        userId: 0,
      },
    );

    if (!updatedPlace) {
      response = {
        message: 'Houve um problema ao tentar atualizar os dados',
        status: 500,
      };
      return response;
    }

    response = {
      _id: updatedPlace?._id,
      name: updatedPlace?.name,
      photo: updatedPlace?.photo,
    };

    return response;
  }

  public async deletePlace(payload: IPlacePayload): Promise<resDelete | resErro> {
    const { _id, userId } = payload;
    let response: resDelete | resErro;

    const deletedPlace = await PlaceModel.findOneAndDelete({ _id, userId })
      .then((result) => {
        if (result) {
          response = {
            _id: result._id,
            name: result.name,
            photo: result.photo,
          };
          return response;
        }
        response = { message: 'Item não encontrado', status: 404 };
        return response;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.message);
        response = { message: 'Houve um erro ao tentar deletar esse item', status: 500 };
        return response;
      });

    return deletedPlace;
  }
}
