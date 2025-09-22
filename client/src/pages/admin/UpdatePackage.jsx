import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch package details
  const getPackageData = async () => {
    try {
      const res = await fetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) {
        setFormData({ ...data.packageData });
      } else {
        setError(data?.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Upload images to Cloudinary
  const handleImageSubmit = async () => {
    if (images.length + formData.packageImages.length > 5) {
      setError("You can only upload up to 5 images.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const urls = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "travel-image");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dpkippjxy/image/upload`,
          { method: "POST", body: data }
        );

        const uploaded = await res.json();
        urls.push(uploaded.secure_url);

        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
      }

      setFormData((prev) => ({
        ...prev,
        packageImages: [...prev.packageImages, ...urls],
      }));

      setImages([]);
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete image
  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      packageImages: prev.packageImages.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.packageName || !formData.packageDescription) {
      setError("All fields are required.");
      return;
    }

    if (formData.packageDiscountPrice >= formData.packagePrice) {
      setError("Discount Price must be less than Regular Price.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/package/update-package/${params?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      alert(data.message);
      navigate(`/package/${params?.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-6">
      {/* Form */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Update Package</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="packageName">Name</Label>
              <Input
                id="packageName"
                value={formData.packageName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="packageDescription">Description</Label>
              <Textarea
                id="packageDescription"
                rows={4}
                value={formData.packageDescription}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="packageDestination">Destination</Label>
              <Input
                id="packageDestination"
                value={formData.packageDestination}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="packageDays">Days</Label>
                <Input
                  type="number"
                  id="packageDays"
                  value={formData.packageDays}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="packageNights">Nights</Label>
                <Input
                  type="number"
                  id="packageNights"
                  value={formData.packageNights}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="packageAccommodation">Accommodation</Label>
              <Textarea
                id="packageAccommodation"
                rows={2}
                value={formData.packageAccommodation}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="packageTransportation">Transportation</Label>
              <select
                id="packageTransportation"
                className="border rounded-lg w-full p-2"
                value={formData.packageTransportation}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Boat">Boat</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="packageMeals">Meals</Label>
              <Textarea
                id="packageMeals"
                rows={2}
                value={formData.packageMeals}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="packageActivities">Activities</Label>
              <Textarea
                id="packageActivities"
                rows={2}
                value={formData.packageActivities}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="packagePrice">Price</Label>
              <Input
                type="number"
                id="packagePrice"
                value={formData.packagePrice}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="packageOffer"
                checked={formData.packageOffer}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, packageOffer: checked }))
                }
              />
              <Label htmlFor="packageOffer">Offer</Label>
            </div>

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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Updating..." : "Update Package"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card className="w-full md:w-[30%] h-max">
        <CardHeader>
          <CardTitle>Package Images</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />

          {uploading && (
            <p className="text-sm text-blue-600">
              Uploading... {uploadProgress}%
            </p>
          )}

          <Button
            type="button"
            onClick={handleImageSubmit}
            disabled={uploading || images.length === 0}
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>

          {formData.packageImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {formData.packageImages.map((img, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={img}
                    alt="package"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePackage;
