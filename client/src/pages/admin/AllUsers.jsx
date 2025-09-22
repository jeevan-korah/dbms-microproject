import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"; // adjust import path
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
import { FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getAllUsers?searchTerm=${search}`);
      const data = await res.json();

      if (data && data?.success === false) {
        setError(data?.message);
        setAllUsers([]);
      } else {
        setAllUsers(data);
        setError(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [search]);

  const handleUserDelete = async (userId) => {
    const CONFIRM = confirm(
      "Are you sure? This account will be permanently deleted!"
    );
    if (CONFIRM) {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/delete-user/${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          alert("Something went wrong!");
          setLoading(false);
          return;
        }
        alert(data?.message);
        getUsers();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2 w-full sm:w-1/3"
          />
          <h2 className="font-semibold">Total Users: {allUser.length}</h2>
        </div>

        {loading ? (
          <h1 className="text-center text-lg">Loading...</h1>
        ) : error ? (
          <h1 className="text-center text-red-500 text-lg">{error}</h1>
        ) : allUser.length === 0 ? (
          <h1 className="text-center text-xl">No users found!</h1>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUser.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="text-xs">{user._id}</TableCell>
                  <TableCell className="text-xs">{user.username}</TableCell>
                  <TableCell className="text-xs">{user.email}</TableCell>
                  <TableCell className="text-xs">{user.address}</TableCell>
                  <TableCell className="text-xs">{user.phone}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUserDelete(user._id)}
                      disabled={loading}
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AllUsers;
