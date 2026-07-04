import { useEffect, useState } from "react";
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import { FlameIcon, HamburgerIcon } from "lucide-react";

const Dashboard = () => {

  const {user, allActivityLogs, allFoodLogs} = useAppContext()
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);
  
  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  // Load user data
  const loadUserData = ()=>{
    const today = new Date().toISOString().split('T')[0];
    const foodData = allFoodLogs.filter((f: FoodEntry)=> f.createdAt?.split('T')[0] === today)
    setTodayFood(foodData)

    const activityData = allActivityLogs.filter((f: ActivityEntry)=> f.createdAt?.split('T')[0] === today)

    setTodayActivities(activityData)
  }

  useEffect(()=>{
    (()=>{loadUserData()})();
  },[allActivityLogs, allFoodLogs])

  const totalCalories: number = todayFood.reduce((sum, item)=> sum + item.calories, 0)

  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;

  const totalActiveMinutes: number = todayActivities.reduce((sum, item)=> sum + item.duration, 0)

  const totalBurned: number = todayActivities.reduce((sum, item)=> sum + (item.calories || 0), 0)

  const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_CALORIE_LIMIT)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1">{`Hi, there! 👋 ${user?.username}`}</h1>

        {/* Motivation Card */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="text-white font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-grid">
        {/* Calories Card */}
        <Card className="shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <HamburgerIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Consumed</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalCalories}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Limit</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{DAILY_CALORIE_LIMIT}</p>
            </div>
          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
          <div className="mt-4 flex justify-between items-center">
            <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'}`}>
              <span className="text-sm font-medium">
                {remainingCalories >= 0 ? `${remainingCalories} kcal remaining` : `${Math.abs(remainingCalories)} kcal over`}
              </span>
            </div>
            <span className="text-sm text-slate-400">{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%</span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <FlameIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Burned</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalBurned}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{user?.dailyCalorieBurn || 400}</p>
            </div>
          </div>
          <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
        </Card>
      </div>

    </div>
  )
}

export default Dashboard
