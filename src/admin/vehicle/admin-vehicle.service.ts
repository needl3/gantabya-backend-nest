import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Vehicle } from "src/vehicles/vehicle.schema";
import { CreateVehicleRequestDto, UpdateVehicleRequestDto } from "./admin-vehicle.dto";

@Injectable()
export class AdminVehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>
  ) { }

  async createVehicle(createVehicleDto: CreateVehicleRequestDto) {
    const vehicle = new this.vehicleModel(createVehicleDto)

    return await vehicle.save()
  }

  async updateVehicle(vehicleId: Types.ObjectId, updateVehicleDto: UpdateVehicleRequestDto) {
    const updatedVehicle = this.vehicleModel.findByIdAndUpdate(vehicleId, updateVehicleDto)

    if (!updatedVehicle) throw new Error("Vehicle not found")

    return updatedVehicle.getUpdate()
  }

  async deleteVehicle(id: string) {
    const vehicle = await this.vehicleModel.findOne({ _id: id })

    if (!vehicle) throw new Error("Vehicle not found")

    const deletedStatus = await vehicle.deleteOne();

    if (deletedStatus.acknowledged) return vehicle

    throw new Error("Vehicle could not be deleted")
  }

  async listVehicles(page: number, limit: number) {
    const vehicles = await this.vehicleModel.find().skip(page * limit).limit(limit)

    return vehicles
  }

  async getVehicle(id: string) {
    const vehicle = await this.vehicleModel.findOne({ _id: id })

    if (!vehicle) throw new Error("Vehicle not found")

    return vehicle
  }
}
