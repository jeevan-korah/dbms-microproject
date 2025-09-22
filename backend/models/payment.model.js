import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
      minlength: 16,
      maxlength: 16,
    },
    cvv: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 4,
    },
    expiryDate: {
      type: String, // format: MM/YY
      required: true,
    },
    nameOnCard: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
