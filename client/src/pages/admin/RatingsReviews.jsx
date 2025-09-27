import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let url =
        filter === "most"
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
          : `/api/package/get-packages?searchTerm=${search}&sort=packageRating`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setShowMoreBtn(data?.packages?.length > 8);
      } else {
        alert(data?.message || "Something went wrong!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onShowMoreSClick = async () => {
    const startIndex = packages.length;
    let url =
      filter === "most"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    setPackages([...packages, ...data?.packages]);
    if (data?.packages?.length < 9) setShowMoreBtn(false);
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "most"].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f === "most" ? "Most Rated" : "All"}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading or Empty */}
        {loading ? (
          <h1 className="text-center text-lg">Loading...</h1>
        ) : packages.length === 0 ? (
          <h1 className="text-center text-2xl">No Ratings Available!</h1>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pack) => (
                <TableRow
                  key={pack._id}
                  className="hover:bg-gray-50 transition"
                >
                  {/* Package Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Link to={`/package/ratings/${pack._id}`}>
                        <img
                          src={pack?.packageImages[0]}
                          alt={pack?.packageName}
                          className="w-20 h-20 rounded object-cover"
                        />
                      </Link>
                      <Link
                        to={`/package/ratings/${pack._id}`}
                        className="font-semibold hover:underline"
                      >
                        {pack?.packageName}
                      </Link>
                    </div>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Rating
                        value={pack?.packageRating}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <span className="text-sm text-gray-600">
                        ({pack?.packageTotalRatings})
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Link to={`/package/ratings/${pack._id}`}>
                      <Button size="sm" variant="outline">
                        View Reviews
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Show More Button */}
        {showMoreBtn && (
          <div className="flex justify-center mt-4">
            <Button onClick={onShowMoreSClick} size="sm" variant="default">
              Show More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingsReviews;
