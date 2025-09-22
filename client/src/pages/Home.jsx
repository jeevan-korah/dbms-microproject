import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Star,
  Users,
  Calendar,
  Award,
  Home as HomeIcon,
  Utensils,
  Plane,
  Heart,
} from "lucide-react";
import { FaCalendar, FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=packageRating&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&limit=8"
      );
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/package/get-packages?sort=createdAt&offer=true&limit=6"
      );
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  const handleSearch = () => {
    navigate(`/search?searchTerm=${search}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            {/* Main heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-[#002b11] text-balance leading-tight">
              Where to?
            </h1>

            <div className="max-w-4xl mx-auto">
              {/* Search tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-[#002b11] bg-[#002b11] text-white"
                >
                  <Search className="h-4 w-4" />
                  <span>Search All</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#002b11] hover:bg-gray-50"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Hotels</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#002b11] hover:bg-gray-50"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Things to Do</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#002b11] hover:bg-gray-50"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Restaurants</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#002b11] hover:bg-gray-50"
                >
                  <Plane className="h-4 w-4" />
                  <span>Flights</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 hover:border-[#002b11] hover:bg-gray-50"
                >
                  <Heart className="h-4 w-4" />
                  <span>Holiday Homes</span>
                </Button>
              </div>

              <div className="flex items-center max-w-2xl mx-auto bg-white border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex-1 flex px-6 py-4 items-center">
                  <Search className="h-4` w-4" />
                  <Input
                    placeholder="Places to go, things to do, hotels..."
                    className="border-0 text-lg shadow-none placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="bg-[#02eb5a] hover:bg-[#02eb5a]/90 text-[#002b11]  rounded-full mr-2 px-8 font-semibold"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      )}

      {/* No Packages State */}
      {!loading &&
        topPackages.length === 0 &&
        latestPackages.length === 0 &&
        offerPackages.length === 0 && (
          <div className="py-16 text-center">
            <h1 className="text-2xl">No Packages Yet!</h1>
          </div>
        )}

      {/* Featured Destinations / Top Packages Section */}
      {!loading && topPackages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-[#002b11]">
                Featured Destinations
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the world's most captivating places with complete
                travel packages
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                size="lg"
                variant="outline"
                className="border-[#002b11] text-[#002b11] hover:bg-[#002b11] hover:text-white bg-transparent"
                onClick={() => navigate("/search?sort=packageRating")}
              >
                View All Destinations
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Travel Packages Section / Latest Packages */}
      {/* {!loading && latestPackages.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-[#002b11]">
                Complete Travel Packages
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for the perfect trip - flights, hotels,
                meals, and experiences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {travelPackages.map((pkg, index) => (
                <div
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg overflow-hidden"
                >
                  <div className="text-center p-6">
                    <div className="mx-auto w-16 h-16 bg-[#02eb5a]/10 rounded-full flex items-center justify-center mb-4">
                      <pkg.icon className="h-8 w-8 text-[#02eb5a]" />
                    </div>
                    <h3 className="text-xl text-[#002b11] font-semibold mb-2">
                      {pkg.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="text-2xl font-bold text-[#02eb5a] mb-2">
                      {pkg.price}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{pkg.duration}</p>
                    <Button className="w-full bg-[#02eb5a] hover:bg-[#02eb5a]/90 text-[#002b11] font-semibold">
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {latestPackages.slice(0, 6).map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Best Offers Section */}
      {!loading && offerPackages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-[#002b11]">
                Best Offers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Perfect for thrill-seekers and outdoor enthusiasts
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose TravelHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make travel planning simple, secure, and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002b11] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of travelers who trust TravelHub for their adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-[#02eb5a] hover:bg-[#02eb5a]/90 text-[#002b11] font-semibold"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/destinations")}
              className="border-white text-white hover:bg-white hover:text-[#002b11] bg-transparent"
            >
              Explore Destinations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Search,
    title: "Easy Search",
    description:
      "Find the perfect destination and accommodation with our powerful search engine.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description:
      "Read authentic reviews from real travelers to make informed decisions.",
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description:
      "Book with confidence with our flexible cancellation and modification policies.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description:
      "We guarantee the best prices and will match any lower price you find elsewhere.",
  },
];

const travelPackages = [
  {
    icon: MapPin,
    title: "Adventure Package",
    description: "Perfect for thrill-seekers and outdoor enthusiasts",
    price: "₹45,000",
    duration: "7 days / 6 nights",
  },
  {
    icon: Heart,
    title: "Romantic Getaway",
    description: "Intimate experiences for couples and honeymooners",
    price: "₹65,000",
    duration: "5 days / 4 nights",
  },
  {
    icon: Users,
    title: "Family Fun",
    description: "Kid-friendly activities and family accommodations",
    price: "₹85,000",
    duration: "6 days / 5 nights",
  },
];

export default Home;
