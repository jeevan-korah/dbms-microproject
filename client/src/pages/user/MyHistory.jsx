import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${search}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
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
  }, [search]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
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
      <Card className="w-[95%] shadow-xl rounded-lg p-3">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading && <p className="text-center text-lg">Loading...</p>}
          {error && <p className="text-center text-lg text-red-600">{error}</p>}

          {/* Search Bar */}
          <div className="w-full border-b pb-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Scrollable Bookings */}
          <ScrollArea className="h-[400px] pr-2">
            {allBookings && allBookings.length > 0 ? (
              allBookings.map((booking, i) => (
                <Card
                  key={i}
                  className="mb-3 flex items-center justify-between gap-3 p-3"
                >
                  {/* Package Image */}
                  <Link to={`/package/${booking?.packageDetails?._id}`}>
                    <img
                      className="w-16 h-16 rounded-md object-cover"
                      src={booking?.packageDetails?.packageImages[0]}
                      alt="Package"
                    />
                  </Link>

                  {/* Package Info */}
                  <div className="flex-1">
                    <Link
                      to={`/package/${booking?.packageDetails?._id}`}
                      className="font-medium hover:underline"
                    >
                      {booking?.packageDetails?.packageName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {booking?.buyer?.username} ({booking?.buyer?.email})
                    </p>
                    <p className="text-sm">{booking?.date}</p>
                  </div>

                  {/* Delete Button */}
                  {(new Date(booking?.date).getTime() < new Date().getTime() ||
                    booking?.status === "Cancelled") && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleHistoryDelete(booking._id)}
                    >
                      Delete
                    </Button>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No history found
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyHistory;
