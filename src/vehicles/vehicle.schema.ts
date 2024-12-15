import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { BookingTxn } from "src/booking_txn/booking_txn.schema";

export type VehicleDocument = HydratedDocument<Vehicle>

@Schema()
export class Vehicle {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  fuelType: string

  @Prop({ required: true })
  @Prop([String])
  images: string[]

  @Prop({ required: true })
  pricePerDay: number

  @Prop({ required: true })
  seatingCapacity: number

  @Prop({ required: true })
  modelYear: number

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BookingTxn', required: false })
  bookingTxn: BookingTxn
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle)
