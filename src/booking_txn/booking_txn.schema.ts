import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/users.schema';
import { Vehicle } from 'src/vehicles/vehicle.schema';

export type BookingTxnDocument = HydratedDocument<BookingTxn>

@Schema()
export class BookingTxn {
  _id: Types.ObjectId

  @Prop({ required: true, unique: true })
  pidx: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  user: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: false })
  vehicle: Vehicle

  @Prop({ required: true })
  from: Date

  @Prop({ required: true })
  to: Date

  @Prop({ required: true })
  price: number

  @Prop({ required: true, default: 'pending' })
  status: 'pending' | 'booked' | 'cancelled' | 'completed'

  @Prop({ required: true })
  pickupCoords: string
}

export const BookingTxnSchema = SchemaFactory.createForClass(BookingTxn)
