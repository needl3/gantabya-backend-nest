import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vehicle } from "./vehicle.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class VehicleService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) { }

  async listAvailableVehicles(page: number, limit: number, type?: string) {
    return await this.vehicleModel.find({
      type,
      bookedBy: null
    }).skip(page * limit).limit(limit)
  }

  async listBookedVehicles(userid: Types.ObjectId, page: number, limit: number, type?: string) {
    return await this.vehicleModel.find({
      type,
      bookedBy: { $eq: userid }
    }).skip(page * limit).limit(limit)
  }
}
