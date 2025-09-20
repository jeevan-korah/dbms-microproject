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
  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={packageData.packageImages[0]}
            alt={packageData.packageName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {packageData.offer && (
            <Badge className="absolute top-3 left-3 bg-[#02eb5a] text-[#002b11] font-semibold">
              Special Offer
            </Badge>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-[#002b11] capitalize truncate">
              {packageData.packageName}
            </CardTitle>
            {packageData.packageTotalRatings > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">
                  {packageData.packageRating}
                </span>
              </div>
            )}
          </div>
          <CardDescription className="text-gray-600 capitalize">
            {packageData.packageDestination}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
            <p className="flex text-sm items-center gap-2 mb-3 text-gray-600">
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

          <div className="bg-[#02eb5a]/10 p-3 rounded-lg mb-3">
            <p className="text-xs font-semibold text-[#002b11] mb-1">
              Complete Travel Package
            </p>
            <p className="text-xs text-gray-600">
              Hotels • Meals • Guided tours
            </p>
          </div>

          {packageData.packageTotalRatings > 0 && (
            <p className="flex items-center text-sm mb-3">
              <Rating
                value={packageData.packageRating}
                size="small"
                readOnly
                precision={0.1}
              />
              <span className="ml-2 flex items-center space-x-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>({packageData.packageTotalRatings} reviews)</span>
              </span>
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {packageData.offer && packageData.packageDiscountPrice ? (
                <div className="flex flex-col">
                  <span className="line-through text-gray-500 text-sm">
                    ₹{packageData.packagePrice}
                  </span>
                  <span className="font-medium text-green-700 text-lg">
                    ₹{packageData.packageDiscountPrice}
                  </span>
                </div>
              ) : (
                <span className="font-medium text-green-700 text-lg">
                  ₹{packageData.packagePrice}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#002b11] text-[#002b11] hover:bg-[#002b11] hover:text-white bg-transparent"
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
