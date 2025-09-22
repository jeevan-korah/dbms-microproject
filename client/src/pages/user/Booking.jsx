import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, CheckCircle } from "lucide-react";

export default function Booking() {
  const { currentUser } = useSelector((state) => state.user);
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookingData, setBookingData] = useState({
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: "",
    totalPrice: 0,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "", // ✅ fixed variable to match backend
    cvv: "",
    nameOnCard: currentUser?.username || "",
  });

  const [minDate, setMinDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${packageId}`);
      const data = await res.json();
      if (data?.success) {
        setPackageData(data.packageData);
      } else {
        setError(data?.message || "Failed to load package");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load package");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = new Date(Date.now() + 24 * 60 * 60 * 1000);
    setMinDate(t.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!packageId) return;
    getPackageData();
  }, [packageId]);

  useEffect(() => {
    if (!packageData) return;
    const pricePerPerson =
      packageData.packageDiscountPrice || packageData.packagePrice || 0;
    setBookingData((prev) => ({
      ...prev,
      packageDetails: packageId,
      buyer: currentUser?._id || null,
      totalPrice: pricePerPerson * prev.persons,
    }));
    setPaymentInfo((p) => ({
      ...p,
      nameOnCard: currentUser?.username || p.nameOnCard,
    }));
  }, [packageData, currentUser]);

  useEffect(() => {
    if (!packageData) return;
    const pricePerPerson =
      packageData.packageDiscountPrice || packageData.packagePrice || 0;
    setBookingData((prev) => ({
      ...prev,
      totalPrice: pricePerPerson * prev.persons,
    }));
  }, [bookingData.persons, packageData]);

  const incPersons = () =>
    setBookingData((prev) => ({
      ...prev,
      persons: Math.min(10, prev.persons + 1),
    }));
  const decPersons = () =>
    setBookingData((prev) => ({
      ...prev,
      persons: Math.max(1, prev.persons - 1),
    }));

  const handleDateChange = (e) =>
    setBookingData({ ...bookingData, date: e.target.value });
  const handlePaymentChange = (e) =>
    setPaymentInfo({ ...paymentInfo, [e.target.id]: e.target.value });

  const handleBookPackage = async () => {
    if (
      !bookingData.packageDetails ||
      !bookingData.buyer ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      !bookingData.date
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...bookingData,
        ...paymentInfo, // spread payment info fields to match backend keys
      };

      const res = await fetch(`/api/booking/book-package/${packageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.success) {
        setLoading(false);
        alert(data?.message || "Booking successful!");
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        setLoading(false);
        alert(data?.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const format = (v) => `₹${Number(v || 0).toFixed(2)}`;

  if (loading && !packageData)
    return (
      <div className="p-8">
        <p className="text-center">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-8">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Confirm Your Booking
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Package Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded overflow-hidden bg-gray-100">
                  <img
                    src={packageData?.packageImages?.[0] || "/placeholder.svg"}
                    alt={packageData?.packageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {packageData?.packageName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Destination:</span>{" "}
                    {packageData?.packageDestination}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Duration:</span>{" "}
                    {packageData?.packageDays} day
                    {packageData?.packageDays > 1 ? "s" : ""} •{" "}
                    {packageData?.packageNights} night
                    {packageData?.packageNights > 1 ? "s" : ""}
                  </p>
                  <div className="mt-3">
                    {packageData?.packageOffer ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400">
                          {format(packageData.packagePrice)}
                        </span>
                        <span className="text-lg font-semibold">
                          {format(packageData.packageDiscountPrice)}
                        </span>
                        <span className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(
                            ((+packageData.packagePrice -
                              +packageData.packageDiscountPrice) /
                              +packageData.packagePrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg font-semibold">
                        {format(packageData?.packagePrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Select date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={bookingData.date}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <Label>Guests</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button onClick={decPersons} size="sm">
                      -
                    </Button>
                    <div className="w-12 text-center font-medium">
                      {bookingData.persons}
                    </div>
                    <Button onClick={incPersons} size="sm">
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Username</Label>
                  <Input value={currentUser?.username || ""} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={currentUser?.email || ""} disabled />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <Label>Phone</Label>
                  <Input value={currentUser?.phone || ""} disabled />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={currentUser?.address || ""} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Payment Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry (MM/YY)</Label>
                  <Input
                    id="expiryDate" // ✅ fixed to match state & backend
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  value={paymentInfo.nameOnCard}
                  onChange={handlePaymentChange}
                />
              </div>

              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <p>
                  Your card details are only collected for demo purposes — this
                  site is not processing real payments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Booking Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Price per person</span>
                <span>
                  {format(
                    packageData?.packageDiscountPrice ||
                      packageData?.packagePrice
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Guests</span>
                <span>{bookingData.persons}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{format(bookingData.totalPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Service fee</span>
                <span>{format(25)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes</span>
                <span>
                  {format(Math.round((bookingData.totalPrice || 0) * 0.1))}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  {format(
                    (bookingData.totalPrice || 0) +
                      25 +
                      Math.round((bookingData.totalPrice || 0) * 0.1)
                  )}
                </span>
              </div>

              <Button
                className="w-full mt-2"
                onClick={handleBookPackage}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>

              <div className="space-y-2 text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Secure (demo) payment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
