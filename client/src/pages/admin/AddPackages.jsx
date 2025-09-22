import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { Switch } from "../../../components/ui/switch";

const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });

  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  // ✅ Cloudinary Upload Function
  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "travel-image");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dpkippjxy/image/upload",
          {
            method: "POST",
            body: fd,
          }
        );

        if (!res.ok) return reject("Upload failed");

        const data = await res.json();
        resolve(data.secure_url);
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleImageSubmit = () => {
    if (
      images.length > 0 &&
      images.length + formData.packageImages.length < 6
    ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            packageImages: formData.packageImages.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.error(err);
          setImageUploadError("Image upload failed (check size/format)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per package");
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      alert("All fields are required!");
      return;
    }
    if (formData.packagePrice < 500) {
      alert("Price should be greater than 500!");
      return;
    }
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      alert("Regular Price should be greater than Discount Price!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/package/create-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }

      setLoading(false);
      setError(false);
      alert(data?.message);

      setFormData({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
      });
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-semibold">
            Add New Package
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Package Name */}
            <div>
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={formData.packageName}
                onChange={handleChange}
                placeholder="Enter package name"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="packageDescription">Description</Label>
              <Textarea
                id="packageDescription"
                value={formData.packageDescription}
                onChange={handleChange}
                placeholder="Write a short description..."
              />
            </div>

            {/* Destination */}
            <div>
              <Label htmlFor="packageDestination">Destination</Label>
              <Input
                id="packageDestination"
                value={formData.packageDestination}
                onChange={handleChange}
                placeholder="Enter destination"
              />
            </div>

            {/* Days & Nights */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageDays">Days</Label>
                <Input
                  type="number"
                  id="packageDays"
                  value={formData.packageDays}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="packageNights">Nights</Label>
                <Input
                  type="number"
                  id="packageNights"
                  value={formData.packageNights}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </div>

            {/* Accommodation */}
            <div>
              <Label htmlFor="packageAccommodation">Accommodation</Label>
              <Textarea
                id="packageAccommodation"
                value={formData.packageAccommodation}
                onChange={handleChange}
                placeholder="Hotel, Resort, etc."
              />
            </div>

            {/* Transportation */}
            <div>
              <Label htmlFor="packageTransportation">Transportation</Label>
              <Select
                onValueChange={(val) =>
                  setFormData({ ...formData, packageTransportation: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transportation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flight">Flight</SelectItem>
                  <SelectItem value="Train">Train</SelectItem>
                  <SelectItem value="Boat">Boat</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meals */}
            <div>
              <Label htmlFor="packageMeals">Meals</Label>
              <Textarea
                id="packageMeals"
                value={formData.packageMeals}
                onChange={handleChange}
                placeholder="Breakfast, Lunch, Dinner..."
              />
            </div>

            {/* Activities */}
            <div>
              <Label htmlFor="packageActivities">Activities</Label>
              <Textarea
                id="packageActivities"
                value={formData.packageActivities}
                onChange={handleChange}
                placeholder="Sightseeing, Hiking, etc."
              />
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="packagePrice">Price</Label>
              <Input
                type="number"
                id="packagePrice"
                value={formData.packagePrice}
                onChange={handleChange}
              />
            </div>

            {/* Offer */}
            <div className="flex items-center gap-2">
              <Switch
                id="packageOffer"
                checked={formData.packageOffer}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, packageOffer: val })
                }
              />
              <Label htmlFor="packageOffer">Enable Offer</Label>
            </div>

            {/* Discount Price */}
            {formData.packageOffer && (
              <div>
                <Label htmlFor="packageDiscountPrice">Discount Price</Label>
                <Input
                  type="number"
                  id="packageDiscountPrice"
                  value={formData.packageDiscountPrice}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Images */}
            <div>
              <Label htmlFor="packageImages">
                Upload Images
                <span className="text-xs text-red-500 ml-2">
                  (Max 5, &lt;2MB each)
                </span>
              </Label>
              <Input
                type="file"
                id="packageImages"
                multiple
                onChange={(e) => setImages(e.target.files)}
              />
            </div>

            {imageUploadError && (
              <p className="text-sm text-red-600">{imageUploadError}</p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Upload Images Button */}
            {images.length > 0 && (
              <Button
                type="button"
                variant="outline"
                disabled={uploading || loading}
                onClick={handleImageSubmit}
              >
                {uploading
                  ? `Uploading...(${imageUploadPercent}%)`
                  : "Upload Images"}
              </Button>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={uploading || loading}>
              {loading ? "Loading..." : "Add Package"}
            </Button>

            {/* Uploaded Images */}
            {formData.packageImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {formData.packageImages.map((image, i) => (
                  <div
                    key={i}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt="preview"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(i)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPackages;
