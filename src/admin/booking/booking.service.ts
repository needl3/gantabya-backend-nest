import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BookingTxn } from "src/booking_txn/booking_txn.schema";
import { Vehicle } from "src/vehicles/vehicle.schema";

@Injectable()
export class AdminBookingService {
  constructor(
    @InjectModel(BookingTxn.name) private readonly bookingTxnModel: Model<BookingTxn>,
    @InjectModel(Vehicle.name) private readonly vehicleModel: Model<Vehicle>,
  ) { }
  async listBookings(
    page: number,
    limit: number,
    vehicleType?: string,
    bookingStatus?: string
  ) {
    return await this.bookingTxnModel.find({
      ...(vehicleType ? { vehicle: { type: vehicleType } } : {}),
      ...(bookingStatus ? { status: bookingStatus } : {})
    })
      .skip(page * limit)
      .limit(limit)
      .populate('user')
      .populate('vehicle')
  }

  async unbook(bookingId: Types.ObjectId) {
    console.log("Unbooking booking", bookingId)
    console.log("Booking from query: ", await this.bookingTxnModel.findOne({ _id: bookingId }))
    const booking = await this.bookingTxnModel.findOneAndUpdate(
      { _id: bookingId },
      {
        status: 'completed',
      },
      { new: true })
    console.log("Booking", booking)

    if (!booking) return null

    this.vehicleModel.findOneAndUpdate(
      { _id: booking.vehicle },
      {
        bookingTxn: null
      },
      { new: true })
    return booking
  }
}
