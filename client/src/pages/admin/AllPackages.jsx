import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"; // adjust import based on your setup

const AllPackages = () => {
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
        filter === "offer"
          ? `/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest"
          ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt`
          : filter === "top"
          ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating`
          : `/api/package/get-packages?searchTerm=${search}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
        setShowMoreBtn(data?.packages?.length > 8);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onShowMoreSClick = async () => {
    const startIndex = packages.length;
    let url =
      filter === "offer"
        ? `/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}`
        : filter === "latest"
        ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    setPackages([...packages, ...data?.packages]);
    if (data?.packages?.length < 9) setShowMoreBtn(false);
  };

  const handleDelete = async (packageId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data?.message);
      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2 w-full sm:w-1/3"
          />

          <div className="flex gap-2 flex-wrap">
            {["all", "offer", "latest", "top"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <h1 className="text-center text-lg">Loading...</h1>
        ) : packages.length === 0 ? (
          <h1 className="text-center text-2xl">No Packages Yet!</h1>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pack) => (
                <TableRow
                  key={pack._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Link to={`/package/${pack._id}`}>
                        <img
                          src={pack?.packageImages[0]}
                          alt={pack?.packageName}
                          className="w-20 h-20 rounded object-cover"
                        />
                      </Link>
                      <Link
                        to={`/package/${pack._id}`}
                        className="font-semibold hover:underline"
                      >
                        {pack?.packageName}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/profile/admin/update-package/${pack._id}`}>
                        <Button size="sm" variant="outline" disabled={loading}>
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loading}
                        onClick={() => handleDelete(pack._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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

export default AllPackages;
