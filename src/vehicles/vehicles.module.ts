import { Module } from "@nestjs/common";
import { VehiclesController } from "./vehicles.controller";
import { VehicleService } from "./vehicles.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "./vehicle.schema";
import { UserModule } from "src/users/users.module";
import { BookingTxnModule } from "src/booking_txn/booking_txn.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    UserModule,
    BookingTxnModule
  ],
  controllers: [VehiclesController],
  providers: [VehicleService]
})
export class VehiclesModule { }
