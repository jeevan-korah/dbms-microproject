import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rating } from "@mui/material";

const defaultProfileImg = "https://via.placeholder.com/40"; // fallback avatar

const RatingCard = ({ packageRatings }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packageRatings?.map((rating, i) => (
        <SingleRating key={i} rating={rating} />
      ))}
    </div>
  );
};

const SingleRating = ({ rating }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex items-center gap-3">
        <img
          src={rating.userProfileImg || defaultProfileImg}
          alt={rating.username[0]}
          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
        />
        <CardTitle className="text-sm font-semibold">
          {rating.username}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Rating */}
        <Rating
          value={rating.rating || 0}
          precision={0.1}
          readOnly
          size="small"
        />

        {/* Review */}
        <p className="text-gray-700 text-sm">
          {rating.review.length > 100
            ? expanded
              ? rating.review
              : rating.review.substring(0, 100) + "..."
            : rating.review || (rating.rating < 3 ? "Not Bad" : "Good")}
        </p>

        {rating.review.length > 100 && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:underline p-0"
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingCard;
