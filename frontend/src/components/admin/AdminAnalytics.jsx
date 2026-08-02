import { useEffect, useState } from "react";

import api from "../../api/axios";

import Card from "../ui/Card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

function AdminAnalytics() {
  const [data, setData] = useState(null);

  const loadAnalytics = async () => {
    try {
      const response = await api.get("/admin/analytics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (!data) return null;

  return (
    <div className="mt-8 space-y-8">
      {/* Emergency Trend */}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">
          📈 Emergency Trend (Last 7 Days)
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Status Pie */}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">🥧 Emergency Status</h2>

        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.status_distribution}

                dataKey="count"

                nameKey="status"

                outerRadius={100}

                label
              >
                {data.status_distribution.map((entry, index) => (
                  <Cell
                    key={index}

                    fill={
                      ["#22c55e", "#ef4444", "#eab308", "#3b82f6"][index % 4]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ambulance Usage */}

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">🚑 Ambulance Usage</h2>

        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data.ambulance_usage}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="ambulance.vehicle_number" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"

                fill="#16a34a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default AdminAnalytics;
