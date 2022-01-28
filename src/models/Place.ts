import mongoose, { Schema, model, Types } from 'mongoose';

export interface IPlace {
  userId: Types.ObjectId;
  name: string;
  photo: string;
  status?: number;
}

const schema = new Schema<IPlace>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID de usuário é obrigatório'],
  },
  name: { type: String, required: true },
  photo: {
    type: String,
    required: [true, 'Photo é obrigatório'],
  },
});

const PlaceModel = model<IPlace>('Place', schema);

export default PlaceModel;
