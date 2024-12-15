import { Module } from "@nestjs/common";
import { AdminVehicleController } from "./admin-vehicle.controller";
import { AdminVehicleService } from "./admin-vehicle.service";
import { Vehicle, VehicleSchema } from "src/vehicles/vehicle.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }])],
  controllers: [AdminVehicleController],
  providers: [AdminVehicleService],
})
export class AdminVehicleModule { }
