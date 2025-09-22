import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const Payments = () => {
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
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%]">
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            {/* <h1 className="text-2xl text-center font-semibold">Payments</h1> */}

            <Input
              type="text"
              placeholder="Search Username or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/3"
            />

            {loading ? (
              <h1 className="text-center text-lg">Loading...</h1>
            ) : error ? (
              <h1 className="text-center text-lg text-red-500">{error}</h1>
            ) : allBookings.length === 0 ? (
              <h1 className="text-center text-2xl">No Payments Found!</h1>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBookings.map((booking) => (
                    <TableRow
                      key={booking._id}
                      className="hover:bg-gray-50 transition text-xs lg:text-sm"
                    >
                      <TableCell>
                        <div className=" items-center gap-3">
                          {/* <Link to={`/package/${booking?.packageDetails?._id}`}>
                            <img
                              src={booking?.packageDetails?.packageImages[0]}
                              alt={booking?.packageDetails?.packageName}
                              className="w-16 h-16 rounded object-cover"
                            />
                          </Link> */}
                          <Link
                            to={`/package/${booking?.packageDetails?._id}`}
                            className="font-semibold hover:underline"
                          >
                            {booking?.packageDetails?.packageName}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{booking?.buyer?.username}</TableCell>
                      <TableCell>{booking?.buyer?.email}</TableCell>
                      <TableCell>{booking?.date}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{booking?.totalPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
