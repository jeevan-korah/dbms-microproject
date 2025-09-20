import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Chart from "../components/Chart";

// ShadCN components
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-currentBookings?searchTerm=${searchTerm}`
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Something went wrong!");
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        { method: "POST" }
      );
      const data = await res.json();
      setLoading(false);
      alert(data?.message);
      if (data?.success) getAllBookings();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-full md:w-11/12 lg:w-[100%] flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Search by Username or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            {currentBookings.length > 0 && <Chart data={currentBookings} />}

            {loading && <p className="text-center text-lg">Loading...</p>}
            {error && !loading && (
              <p className="text-center text-red-600 text-lg">{error}</p>
            )}

            <ScrollArea className="w-full h-96">
              <div className="flex flex-col gap-2">
                {currentBookings.map((booking) => (
                  <Card
                    key={booking._id}
                    className="flex flex-col sm:flex-row items-center justify-between p-3 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Link to={`/package/${booking?.packageDetails?._id}`}>
                        <img
                          src={booking?.packageDetails?.packageImages[0]}
                          alt="Package"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          to={`/package/${booking?.packageDetails?._id}`}
                          className="font-semibold hover:underline"
                        >
                          {booking?.packageDetails?.packageName}
                        </Link>
                        <p className="text-sm text-gray-500">{booking?.date}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 text-sm">
                      <p>{booking?.buyer?.username}</p>
                      <p>{booking?.buyer?.email}</p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllBookings;
