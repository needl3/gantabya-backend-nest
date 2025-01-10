import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vehicle } from "./vehicle.schema";
import { Model, Types } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { KHALTI_KEY_IDENTIFIER } from "src/common/constants/env.constants";
import { User } from "src/users/users.schema";
import { CheckoutFailedKhaltiResponse, CheckoutSuccessKhaltiResponse, KhaltiPaymentVerificationResponse } from "./vehicle.dto";
import { BookingTxnService } from "src/booking_txn/booking_txn.service";

@Injectable()
export class VehicleService {
  khaltiOptions: Record<string, any>
  khaltiCheckoutUrl: string
  khaltiVerificationUrl: string
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private readonly configService: ConfigService,
    private readonly bookingTxnService: BookingTxnService
  ) {
    // TODO: Move khalti to a separate service
    this.khaltiOptions = {
      'method': 'POST',
      'headers': {
        'Authorization': `key ${this.configService.get<string>(KHALTI_KEY_IDENTIFIER)}`,
        'Content-Type': 'application/json',
      },
    };
    this.khaltiCheckoutUrl = 'https://a.khalti.com/api/v2/epayment/initiate/'
    this.khaltiVerificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/'
  }

  async listAvailableVehicles(page: number, limit: number, type?: string) {
    return await this.vehicleModel.find({
      type,
      bookingTxn: null
    }).skip(page * limit).limit(limit)
  }

  async listBookedVehicles(userid: Types.ObjectId, page: number, limit: number, type?: string) {
    // TODO: Replace with aggregate query
    const bookingTxns = await this.bookingTxnService.findByUser(userid)
    const bookedVehicles = await this.vehicleModel.find({
      ...(type ? { type } : {}),
      bookingTxn: { $in: bookingTxns.map(txn => txn._id) }
    }).skip(page * limit).limit(limit)

    return bookedVehicles.map(vehicle => ({
      vehicle: vehicle.toJSON(),
      bookingInfo: bookingTxns.find(txn => txn._id.toString() === vehicle.bookingTxn._id.toString())
    }))
  }

  async getVehicleById(id: Types.ObjectId) {
    return await this.vehicleModel.findById(id)
  }

  async createKhaltiCheckoutSession(bookingUser: User, vehicleDetails: Vehicle): Promise<CheckoutSuccessKhaltiResponse | null> {
    const khaltiSessionResponse: CheckoutSuccessKhaltiResponse | CheckoutFailedKhaltiResponse = await fetch(this.khaltiCheckoutUrl, {
      ...this.khaltiOptions,
      body: JSON.stringify({
        "return_url": `http://localhost:5173/vehicle/book/${vehicleDetails._id}/confirm`,
        "website_url": "http://localhost:3000",
        "amount": vehicleDetails.pricePerDay,
        "purchase_order_id": vehicleDetails._id,
        "purchase_order_name": vehicleDetails.name,
        "customer_info": {
          "name": bookingUser.name,
          "email": bookingUser.email,
        }
      })
    }).then(r => r.json())

    if ("error_key" in khaltiSessionResponse || "status_code" in khaltiSessionResponse) {
      return null
    }

    return khaltiSessionResponse
  }

  async verifyPayment(pidx: string): Promise<boolean> {
    const response: KhaltiPaymentVerificationResponse = await fetch(this.khaltiVerificationUrl, {
      ...this.khaltiOptions,
      body: JSON.stringify({
        pidx
      }),
    }).then(r => r.json())

    return response.status === 'Completed'
  }

  async bookVehicle(userId: Types.ObjectId, vehicleid: Types.ObjectId, pidx: string) {
    // TODO: Wrap these in a transaction
    const bookingTxn = await this.bookingTxnService.markAsBooked(pidx, userId)
    return {
      vehicle: await this.vehicleModel.findOneAndUpdate(
        { _id: vehicleid },
        { bookingTxn }),
      bookingInfo: bookingTxn
    }
  }
}
