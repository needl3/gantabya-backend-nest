import { Module } from "@nestjs/common";
import { BookingTxnService } from "./booking_txn.service";
import { BookingTxn, BookingTxnSchema } from "./booking_txn.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: BookingTxn.name, schema: BookingTxnSchema }])],
  controllers: [],
  providers: [BookingTxnService],
  exports: [BookingTxnService]
})
export class BookingTxnModule { }
