import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const MyBookings = () => {
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
        `/api/booking/get-UserCurrentBookings/${currentUser?._id}?searchTerm=${searchTerm}`
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
    } catch (error) {
      console.log(error);
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
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-[95%] shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            View and manage all your active bookings
          </CardDescription>
          <Input
            className="mt-2"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && currentBookings?.length === 0 && (
            <p className="text-muted-foreground text-center py-6">
              No bookings found
            </p>
          )}

          <ScrollArea className="h-[400px] pr-3">
            {currentBookings.map((booking, i) => (
              <Card
                key={i}
                className="mb-3 border p-3 flex flex-wrap items-center justify-between gap-3"
              >
                <Link
                  to={`/package/${booking?.packageDetails?._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    className="w-16 h-16 object-cover rounded-md"
                    src={booking?.packageDetails?.packageImages[0]}
                    alt="Package"
                  />
                  <p className="hover:underline font-medium">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      {booking?.buyer?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking?.buyer?.email}
                    </p>
                  </div>
                  <p className="text-sm">{booking?.date}</p>
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBookings;
