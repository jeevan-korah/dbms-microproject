import Booking from "../models/booking.model.js";
import Package from "../models/package.model.js";
import Payment from "../models/payment.model.js";
import { ObjectId } from "mongodb";

// ------------------- BOOK PACKAGE WITH PAYMENT -------------------
export const bookPackage = async (req, res) => {
  try {
    
    const {
      packageDetails,
      buyer,
      totalPrice,
      persons,
      date,
      cardNumber,
      cvv,
      expiryDate,
      nameOnCard,
    } = req.body;

    // ensure user is booking with their own account
    if (req.user.id !== buyer) {
      return res.status(401).send({
        success: false,
        message: "You can only buy on your account!",
      });
    }

    // ensure all booking + payment fields are provided
    if (
      !packageDetails ||
      !buyer ||
      !totalPrice ||
      !persons ||
      !date ||
      !cardNumber ||
      !cvv ||
      !expiryDate ||
      !nameOnCard
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields (including payment) are required!",
      });
    }

    // validate package
    const validPackage = await Package.findById(packageDetails);
    if (!validPackage) {
      return res.status(404).send({
        success: false,
        message: "Package Not Found!",
      });
    }

    // create booking
    const newBooking = await Booking.create({
      packageDetails,
      buyer,
      totalPrice,
      persons,
      date,
    });

    // create payment linked to this booking
    const newPayment = await Payment.create({
      booking: newBooking._id,
      cardNumber,
      cvv,
      expiryDate,
      nameOnCard,
      status: "Paid", // later handle with payment gateway
    });

    if (newBooking && newPayment) {
      return res.status(201).send({
        success: true,
        message: "Package Booked and Payment Successful!",
        booking: newBooking,
        payment: newPayment,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while booking/payment!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server Error!",
    });
  }
};

// ------------------- GET CURRENT BOOKINGS FOR ADMIN -------------------
export const getCurrentBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate("packageDetails")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });

    const bookingsFiltered = bookings.filter((b) => b.buyer !== null);

    if (bookingsFiltered.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFiltered,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------- GET ALL BOOKINGS FOR ADMIN -------------------
export const getAllBookings = async (req, res) => {
  try {
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({})
      .populate("packageDetails")
      .populate({
        path: "buyer",
        match: {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      })
      .sort({ createdAt: "asc" });

    const bookingsFiltered = bookings.filter((b) => b.buyer !== null);

    if (bookingsFiltered.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFiltered,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------- GET CURRENT BOOKINGS FOR USER -------------------
export const getUserCurrentBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
      date: { $gt: new Date().toISOString() },
      status: "Booked",
    })
      .populate({
        path: "packageDetails",
        match: { packageName: { $regex: searchTerm, $options: "i" } },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const bookingsFiltered = bookings.filter((b) => b.packageDetails !== null);

    if (bookingsFiltered.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFiltered,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------- GET ALL BOOKINGS FOR USER -------------------
export const getAllUserBookings = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.id) {
      return res.status(401).send({
        success: false,
        message: "You can only get your own bookings!!",
      });
    }
    const searchTerm = req?.query?.searchTerm || "";
    const bookings = await Booking.find({
      buyer: new ObjectId(req?.params?.id),
    })
      .populate({
        path: "packageDetails",
        match: { packageName: { $regex: searchTerm, $options: "i" } },
      })
      .populate("buyer", "username email")
      .sort({ createdAt: "asc" });

    const bookingsFiltered = bookings.filter((b) => b.packageDetails !== null);

    if (bookingsFiltered.length) {
      return res.status(200).send({
        success: true,
        bookings: bookingsFiltered,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "No Bookings Available",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------- DELETE BOOKING HISTORY -------------------
export const deleteBookingHistory = async (req, res) => {
  try {
    if (req?.user?.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only delete your booking history!",
      });
    }
    const deleteHistory = await Booking.findByIdAndDelete(req?.params?.id);
    if (deleteHistory) {
      return res.status(200).send({
        success: true,
        message: "Booking History Deleted!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while deleting booking history!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------- CANCEL BOOKING -------------------
export const cancelBooking = async (req, res) => {
  try {
    if (req.user.id !== req?.params?.userId) {
      return res.status(401).send({
        success: false,
        message: "You can only cancel your bookings!",
      });
    }
    const cancBooking = await Booking.findByIdAndUpdate(
      req?.params?.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (cancBooking) {
      return res.status(200).send({
        success: true,
        message: "Booking Cancelled!",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Something went wrong while cancelling booking!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
