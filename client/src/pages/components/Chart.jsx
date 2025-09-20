import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "timeago.js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const Chart = ({ data }) => {
  const chartData = data?.map((item) => ({
    price: item.totalPrice,
    date: format(item.createdAt),
  }));

  return (
    <Card className="w-full h-60">
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              content={(props) => (
                <div className="bg-gray-800 text-white p-2 rounded shadow-md">
                  {props.payload?.map((item) => (
                    <div key={item.payload.date}>
                      <p>Price: ${item.value}</p>
                      <p>Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar dataKey="price" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Chart;
