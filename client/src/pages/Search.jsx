import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PackageCard from "./PackageCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const Search = () => {
  const navigate = useNavigate();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  //   console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllPackages = async () => {
      setLoading(true);
      setShowMoreBtn(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/package/get-packages?${searchQuery}`);
        const data = await res.json();
        setLoading(false);
        setAllPackages(data?.packages);
        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarSearchData({
        ...sideBarSearchData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "offer") {
      setSideBarSearchData({
        ...sideBarSearchData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = allPackages.length;
    const startIndex = numberOfPackages;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/package/get-packages?${searchQuery}`);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setAllPackages([...allPackages, ...data?.packages]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-white">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="searchTerm"
              className="text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <Input
              type="text"
              id="searchTerm"
              placeholder="Search packages..."
              value={sideBarSearchData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type (Checkboxes) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="offer"
                checked={sideBarSearchData.offer}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: { id: "offer", checked, type: "checkbox" },
                  })
                }
              />
              <label
                htmlFor="offer"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Offer
              </label>
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-2 ">
            <label
              htmlFor="sort_order"
              className="text-sm font-medium text-gray-700"
            >
              Sort
            </label>
            <Select
              defaultValue="createdAt_desc"
              onValueChange={(value) =>
                handleChange({
                  target: { id: "sort_order", value, type: "select-one" },
                })
              }
            >
              <SelectTrigger id="sort_order">
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="packagePrice_desc">
                  Price high to low
                </SelectItem>
                <SelectItem value="packagePrice_asc">
                  Price low to high
                </SelectItem>
                <SelectItem value="packageRating_desc">Top Rated</SelectItem>
                <SelectItem value="packageTotalRatings_desc">
                  Most Rated
                </SelectItem>
                <SelectItem value="createdAt_desc">Latest</SelectItem>
                <SelectItem value="createdAt_asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-[#002b11] hover:bg-[#002b11]/90 text-white uppercase"
          >
            Search
          </Button>
        </form>
      </div>
      {/* ------------------------------------------------------------------------------- */}
      <div className="flex-1">
        {/* Header */}

        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">
          Destination Results:
        </h1>
        <div className="w-full p-5 grid 2xl:grid-cols-4 xlplus:grid-cols-3 lg:grid-cols-2 gap-2">
          {!loading && allPackages.length === 0 && (
            <p className="text-xl text-slate-700">No Packages Found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            allPackages &&
            allPackages.map((packageData, i) => (
              <PackageCard key={i} packageData={packageData} />
            ))}
        </div>
        {showMoreBtn && (
          <button
            onClick={onShowMoreSClick}
            className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
