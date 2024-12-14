import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vehicle } from "./vehicle.schema";
import { Model } from "mongoose";

@Injectable()
export class VehicleService {
  constructor(@InjectModel(Vehicle.name) private userModel: Model<Vehicle>) { }
}
