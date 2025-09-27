import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";

import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);

  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = (photo) => {
    try {
      dispatch(updateUserStart());
      const storage = getStorage(app);
      const photoname = new Date().getTime() + photo.name.replace(/\s/g, "");
      const storageRef = ref(storage, `profile-photos/${photoname}`);
      const uploadTask = uploadBytesResumable(storageRef, photo);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPhotoPercentage(progress);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            const res = await fetch(
              `/api/user/update-profile-photo/${currentUser._id}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar: downloadUrl }),
              }
            );
            const data = await res.json();
            if (data?.success) {
              setFormData({ ...formData, avatar: downloadUrl });
              dispatch(updateUserSuccess(data?.user));
              setProfilePhoto(null);
            } else {
              dispatch(updateUserFailure(data?.message));
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (!data?.success) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserAccountStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success === false) {
        dispatch(deleteUserAccountFailure(data?.message));
        return;
      }
      dispatch(deleteUserAccountSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentUser)
    return <p className="text-red-600 text-center mt-10">Please login first</p>;

  return (
    <div className="container mx-auto py-6 px-0 md:px-4 flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <Card className="w-full md:w-1/3 flex-shrink-0">
        <CardHeader className="flex flex-col items-center">
          <Avatar
            className="h-28 w-28 cursor-pointer"
            onClick={() => fileRef.current.click()}
          >
            <AvatarImage
              src={
                (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                formData.avatar
              }
            />
            <AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
          <CardTitle className="mt-3 text-lg">{formData.username}</CardTitle>
          <p className="text-sm text-gray-500">{formData.email}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {profilePhoto && (
            <Button
              className="w-full"
              onClick={() => handleProfilePhoto(profilePhoto)}
              disabled={loading}
            >
              {loading ? `Uploading... (${photoPercentage}%)` : "Upload Photo"}
            </Button>
          )}

          <Separator />

          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Phone:</span> {formData.phone}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {formData.address}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your account and data will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Right Column */}
      <Card className="w-full md:w-2/3 flex-1 overflow-x-auto">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex space-x-2 overflow-x-auto">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="addPackages">Add Packages</TabsTrigger>
              <TabsTrigger value="allPackages">All Packages</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="reviews">Ratings/Reviews</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="editProfile">Edit Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <AllBookings />
            </TabsContent>
            <TabsContent value="addPackages">
              <AddPackages />
            </TabsContent>
            <TabsContent value="allPackages">
              <AllPackages />
            </TabsContent>
            <TabsContent value="users">
              <AllUsers />
            </TabsContent>
            <TabsContent value="payments">
              <Payments />
            </TabsContent>
            <TabsContent value="reviews">
              <RatingsReviews />
            </TabsContent>
            <TabsContent value="history">
              <History />
            </TabsContent>
            <TabsContent value="editProfile">
              <AdminUpdateProfile />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
