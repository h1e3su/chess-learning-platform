import React from 'react';
import { BookOpen, Trophy, TrendingUp } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="flex-1 ml-64 p-8 bg-neutral-900 min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-outfit font-bold text-white mb-8">Welcome Back, Guest!</h1>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ELO Chart Placeholder */}
        <div className="lg:col-span-2 bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><TrendingUp className="text-emerald-500" /> Rating Progression</h2>
            <select className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-sm">
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-neutral-700 rounded-lg">
            <span className="text-neutral-500">Recharts Line Chart Area</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Trophy className="text-yellow-500" /> Key Stats</h2>
          <div className="bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
            <span className="text-neutral-400">Rapid ELO</span>
            <span className="text-2xl font-bold text-emerald-500">1250</span>
          </div>
          <div className="bg-neutral-900 p-4 rounded-lg flex justify-between items-center">
            <span className="text-neutral-400">Win Rate</span>
            <span className="text-2xl font-bold text-white">52.4%</span>
          </div>
        </div>

        {/* Course Progress */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 mt-4 flex items-center gap-2"><BookOpen className="text-blue-500" /> Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CourseProgressCard title="London System Masterclass" progress={45} />
            <CourseProgressCard title="Endgame Principles" progress={12} />
          </div>
        </div>

      </div>
    </div>
  );
}

function CourseProgressCard({ title, progress }: { title: string, progress: number }) {
  return (
    <div className="bg-neutral-800 rounded-xl p-5 border border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer group">
      <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-500 transition-colors">{title}</h3>
      <div className="flex justify-between text-sm text-neutral-400 mb-2">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-neutral-900 rounded-full h-2">
        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
