import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { FaClock } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";

const PackageCard = ({ packageData }) => {
  const format = (v) => `₹${Number(v || 0).toFixed(2)}`;

  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={packageData.packageImages[0]}
            alt={packageData.packageName}
            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {packageData.offer && (
            <Badge className="absolute top-3 left-3 bg-[#02eb5a] text-[#002b11] font-semibold text-xs sm:text-sm">
              Special Offer
            </Badge>
          )}
        </div>

        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
            <CardTitle className="text-base sm:text-lg text-[#002b11] capitalize truncate">
              {packageData.packageName}
            </CardTitle>
            {packageData.packageTotalRatings > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm sm:text-base">
                  {packageData.packageRating}
                </span>
              </div>
            )}
          </div>
          <CardDescription className="text-gray-600 capitalize text-sm sm:text-base truncate">
            {packageData.packageDestination}
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-0 flex flex-col gap-3">
          {/* Duration */}
          {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
            <p className="flex text-xs sm:text-sm items-center gap-2 text-gray-600">
              <FaClock />
              {+packageData.packageDays > 0 &&
                (+packageData.packageDays > 1
                  ? packageData.packageDays + " Days"
                  : packageData.packageDays + " Day")}
              {+packageData.packageDays > 0 &&
                +packageData.packageNights > 0 &&
                " • "}
              {+packageData.packageNights > 0 &&
                (+packageData.packageNights > 1
                  ? packageData.packageNights + " Nights"
                  : packageData.packageNights + " Night")}
            </p>
          )}

          {/* Highlights */}
          <div className="bg-[#02eb5a]/10 p-2 sm:p-3 rounded-lg">
            <p className="text-xs sm:text-sm font-semibold text-[#002b11] mb-0.5">
              Complete Travel Package
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Hotels • Meals • Guided tours
            </p>
          </div>

          {/* Ratings */}
          {packageData.packageTotalRatings > 0 && (
            <p className="flex items-center text-xs sm:text-sm">
              <Rating
                value={packageData.packageRating}
                size="small"
                readOnly
                precision={0.1}
              />
              <span className="ml-2 flex items-center space-x-1 text-xs text-gray-500">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>({packageData.packageTotalRatings} reviews)</span>
              </span>
            </p>
          )}

          {/* Price & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              {packageData?.packageOffer ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="line-through text-gray-400 text-sm sm:text-base">
                    {format(packageData.packagePrice)}
                  </span>
                  <span className="text-base sm:text-lg font-semibold">
                    {format(packageData.packageDiscountPrice)}
                  </span>
                  <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded">
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
                <div className="text-base sm:text-lg font-semibold">
                  {format(packageData?.packagePrice)}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-[#002b11] text-[#002b11] hover:bg-[#002b11] hover:text-white px-2 py-0 rounded w-full sm:w-auto"
            >
              Explore
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PackageCard;
