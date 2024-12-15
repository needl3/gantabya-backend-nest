import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BookingTxn } from "./booking_txn.schema";
import { Model, Types } from "mongoose";
import { CreateBookingTxnDto } from "./booking_txn.dto";

@Injectable()
export class BookingTxnService {
  constructor(
    @InjectModel(BookingTxn.name) private bookingTxnModel: Model<BookingTxn>,
  ) { }

  async create(bookingTxn: CreateBookingTxnDto) {
    return await this.bookingTxnModel.create(bookingTxn)
  }

  async markAsBooked(pidx: string, userId: Types.ObjectId) {
    const bookingTxn = await this.bookingTxnModel.findOne({ pidx, user: { _id: userId } })
    if (!bookingTxn) return null

    bookingTxn.status = 'booked'
    bookingTxn.save()

    return bookingTxn
  }

  async findByUser(userId: Types.ObjectId) {
    return await this.bookingTxnModel.find({ user: { _id: userId } })
  }
}
