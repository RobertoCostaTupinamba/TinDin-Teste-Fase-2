import { UnsplashService } from '../../services/unsplashService';
import {
  resCreatedPlace,
  IPlacePayload,
  PlaceService,
  resErro,
  resGetById,
  resUpdate,
  resDelete,
} from '../../services/placeService';
import { IPlace } from '../../models/Place';

export default class PlaceController {
  constructor(private place: PlaceService, private unsplash: UnsplashService) {}

  public async create(payload: IPlacePayload): Promise<resCreatedPlace> {
    const response = await this.unsplash.getCreateImage(payload);

    if ((response as resCreatedPlace)?.status) {
      return response as resCreatedPlace;
    }

    return this.place.createPlace({ ...payload, photo: (response as resCreatedPlace).photo });
  }

  public async getAllPlaces(payload: IPlacePayload): Promise<Array<IPlace> | resErro> {
    return this.place.getAllPlaces(payload);
  }

  public async getById(payload: IPlacePayload): Promise<resGetById | resErro> {
    return this.place.getById(payload);
  }

  public async updatePlace(payload: IPlacePayload): Promise<resUpdate | resErro> {
    const response = await this.unsplash.getImageForUpdate(payload);

    if ((response as resErro)?.status) {
      return response as resErro;
    }

    return this.place.updatePlace({ ...payload, photo: (response as resUpdate).photo });
  }

  public async deletePlace(payload: IPlacePayload): Promise<resDelete | resErro> {
    return this.place.deletePlace(payload);
  }
}
