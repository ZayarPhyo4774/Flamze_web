"use client";

import { useEffect, useState } from "react";
import { AdminSidebar, AnalyticsStat } from "@/components/admin/AdminSidebar";
import { Eye, TrendingUp } from "lucide-react";

type AnalyticsData = {
  totalViews: number;
  periodDays: number;
  byBranch: { branch: { name: string; slug: string } | undefined; views: number }[];
  daily: { date: string; views: number }[];
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void fetch(`/api/analytics?days=${days}`)
      .then((res) => res.json())
      .then((json: AnalyticsData) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [days]);

  const handleDaysChange = (value: number) => {
    setLoading(true);
    setDays(value);
  };

  const maxDaily = Math.max(...(data?.daily.map((d) => d.views) ?? [1]), 1);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-zinc-500">Menu views from QR scans and direct visits</p>
          </div>
          <select
            value={days}
            onChange={(e) => handleDaysChange(parseInt(e.target.value, 10))}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : data ? (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <AnalyticsStat label={`Views (${days} days)`} value={data.totalViews} icon={Eye} />
              <AnalyticsStat
                label="Top Branch"
                value={data.byBranch[0]?.branch?.name ?? "—"}
                icon={TrendingUp}
              />
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-white">Views by Branch</h2>
              {data.byBranch.length === 0 ? (
                <p className="text-sm text-zinc-500">No views recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.byBranch.map(({ branch, views }) => (
                    <div
                      key={branch?.slug ?? views}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3"
                    >
                      <span className="text-white">{branch?.name ?? "Unknown"}</span>
                      <span className="font-semibold text-amber-400">{views} views</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Daily Views</h2>
              {data.daily.length === 0 ? (
                <p className="text-sm text-zinc-500">No daily data yet.</p>
              ) : (
                <div className="flex items-end gap-2 h-40">
                  {data.daily.map(({ date, views }) => (
                    <div key={date} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 transition-all"
                        style={{ height: `${(views / maxDaily) * 100}%`, minHeight: views > 0 ? 8 : 0 }}
                        title={`${views} views`}
                      />
                      <span className="text-[10px] text-zinc-500">{date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
