"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Star,
  Calendar,
  Camera,
  Heart,
  Share2,
  Navigation,
  Thermometer,
  Plane,
  Home,
  Activity,
  Coffee,
  User,
} from "lucide-react";
import { Rating } from "@mui/material";
import RatingCard from "./RatingCard";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";

export default function PackagePage() {
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [packageData, setPackageData] = useState({});
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [ratingGiven, setRatingGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) setPackageData(data.packageData);
      else setError(data?.message || "Something went wrong!");
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`/api/rating/get-ratings/${params.id}/4`);
      const data = await res.json();
      setPackageRatings(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(
        `/api/rating/rating-given/${currentUser?._id}/${params?.id}`
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (err) {
      console.log(err);
    }
  };

  const giveRating = async () => {
    if (ratingGiven) return toast.error("You already submitted your rating!");
    if (!ratingsData.rating && !ratingsData.review)
      return toast.error("At least one field is required!");
    try {
      setLoading(true);
      const res = await fetch("/api/rating/give-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data?.message);
        setRatingsData({ ...ratingsData, rating: 0, review: "" });
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else toast.error(data?.message || "Something went wrong!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) checkRatingGiven();
  }, [params.id, currentUser]);

  const renderBulletList = (text) => {
    if (!text) return null;
    return text.split(",").map((item, idx) => (
      <li key={idx} className="flex items-center gap-2 text-sm ">
        <p className="font-semibold">•</p>
        <span>{item.trim()}</span>
      </li>
    ));
  };

  if (loading || !packageData.packageName)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-0 md:px-4 py-8">
      {/* Image Gallery */}
      <div className="grid lg:grid-cols-4 gap-4 mb-8">
        <div className="lg:col-span-3 relative h-64 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden">
          <img
            src={
              packageData.packageImages?.[selectedImageIndex] ||
              "/placeholder.svg"
            }
            alt={packageData.packageName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="secondary" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
            <Camera className="h-4 w-4" />
            <span className="text-sm">
              {packageData.packageImages?.length || 0} photos
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {packageData.packageImages?.slice(0, 3).map((img, i) => (
            <div
              key={i}
              className="relative h-24 sm:h-32 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImageIndex(i)}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`${packageData.packageName} ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Package Info & Sidebar */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {packageData.packageName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />{" "}
                  {packageData.packageDestination}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{" "}
                  {packageData.packageRating} ({packageData.packageTotalRatings}
                  )
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {packageData.packageDays}{" "}
                  Days - {packageData.packageNights} Nights
                </div>
              </div>
            </div>
            {packageData.packageOffer && (
              <Badge variant="secondary" className="text-sm mt-2 md:mt-0">
                {Math.floor(
                  ((+packageData.packagePrice -
                    +packageData.packageDiscountPrice) /
                    +packageData.packagePrice) *
                    100
                )}
                % OFF
              </Badge>
            )}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {packageData.packageDescription}
          </p>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      {" "}
                      <Home className="h-4 w-4 text-primary" />
                      Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {renderBulletList(packageData.packageAccommodation)}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {renderBulletList(packageData.packageActivities)}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      {" "}
                      <Coffee className="h-4 w-4 text-primary" />
                      Meals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {renderBulletList(packageData.packageMeals)}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {currentUser && !ratingGiven && (
                <div className="flex flex-col gap-3">
                  <Rating
                    value={ratingsData.rating}
                    onChange={(e, value) =>
                      setRatingsData({ ...ratingsData, rating: value })
                    }
                  />
                  <textarea
                    className="p-3 border rounded resize-none"
                    rows={3}
                    placeholder="Write a review"
                    value={ratingsData.review}
                    onChange={(e) =>
                      setRatingsData({ ...ratingsData, review: e.target.value })
                    }
                  />
                  <Button
                    onClick={giveRating}
                    disabled={
                      loading || (!ratingsData.rating && !ratingsData.review)
                    }
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              )}
              <RatingCard packageRatings={packageRatings} />
            </TabsContent>

            <TabsContent value="map">
              <Card>
                <CardContent className="h-64 sm:h-96 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Interactive map would be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">
                  {packageData.packageDays} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-semibold">
                  ₹
                  {packageData.packageDiscountPrice || packageData.packagePrice}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Book Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() =>
                  currentUser
                    ? navigate(`/booking/${params.id}`)
                    : navigate("/login")
                }
              >
                Book Package
              </Button>
              <Button variant="outline" className="w-full">
                Add to Wishlist
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                Share {copied && <Check />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
