import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"; // adjust import path if needed

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allBookings?searchTerm=${search}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        setError(false);
      } else {
        setError(data?.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data?.message);
      if (data?.success) getAllBookings();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Booking History</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Search */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by Username or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3"
          />
        </div>

        {/* Loading / Error / Empty */}
        {loading ? (
          <h1 className="text-center text-lg">Loading...</h1>
        ) : error ? (
          <h1 className="text-center text-red-600">{error}</h1>
        ) : allBookings.length === 0 ? (
          <h1 className="text-center text-lg">No booking history found.</h1>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBookings.map((booking) => {
                const isPastOrCancelled =
                  new Date(booking?.date).getTime() < new Date().getTime() ||
                  booking?.status === "Cancelled";

                return (
                  <TableRow key={booking._id} className="hover:bg-gray-50">
                    {/* Package */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link to={`/package/${booking?.packageDetails?._id}`}>
                          <img
                            src={booking?.packageDetails?.packageImages[0]}
                            alt={booking?.packageDetails?.packageName}
                            className="w-12 h-12 rounded object-cover"
                          />
                        </Link>
                        <Link
                          to={`/package/${booking?.packageDetails?._id}`}
                          className="font-semibold hover:underline"
                        >
                          {booking?.packageDetails?.packageName}
                        </Link>
                      </div>
                    </TableCell>

                    {/* Guest */}
                    <TableCell>{booking?.buyer?.username}</TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-gray-600">
                      {booking?.buyer?.email}
                    </TableCell>

                    {/* Date */}
                    <TableCell>{booking?.date}</TableCell>

                    {/* Actions */}
                    <TableCell>
                      {isPastOrCancelled && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleHistoryDelete(booking._id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default History;
