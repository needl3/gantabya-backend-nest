import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsNumber, IsString } from "class-validator";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/users.schema";

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BookedBy', required: false })
  bookedBy: User
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle)
