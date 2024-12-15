import { Module } from "@nestjs/common";
import { VehiclesController } from "./vehicles.controller";
import { VehicleService } from "./vehicles.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "./vehicle.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }])],
  controllers: [VehiclesController],
  providers: [VehicleService]
})
export class VehiclesModule { }
