import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="max-w-lg w-full text-center shadow-lg border border-blue-100">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl font-bold">
            Booking Confirmed!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for booking with us. Your trip has been successfully
            confirmed.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 text-left space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <p className="text-sm">
                Your selected travel dates are confirmed.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <p className="text-sm">
                Destination details are available in your dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <p className="text-sm">Guest information has been recorded.</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Go Home
          </Button>
          <Button onClick={() => navigate("/my-bookings")}>
            View My Bookings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
