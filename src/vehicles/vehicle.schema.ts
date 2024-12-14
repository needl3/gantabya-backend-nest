import { Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "src/users/users.schema";

export type VehicleDocument = HydratedDocument<Vehicle>

export class Vehicle {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  @Prop([String])
  images: string[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ReservedBy' })
  reservedBy: User
}
