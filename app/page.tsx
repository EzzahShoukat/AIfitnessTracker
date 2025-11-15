"use client";

import { useState, useEffect } from "react";

interface Workout {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
  calories: string;
  result: string;
}

export default function Home() {
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastWorkouts, setPastWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load past workouts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("fitnessWorkouts");
    if (stored) {
      try {
        setPastWorkouts(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading workouts:", e);
      }
    }
  }, []);

  // Save workout to localStorage
  const saveWorkout = (workoutData: Omit<Workout, "id">) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Date.now().toString(),
    };
    const updated = [newWorkout, ...pastWorkouts];
    setPastWorkouts(updated);
    localStorage.setItem("fitnessWorkouts", JSON.stringify(updated));
  };

  // Delete workout
  const deleteWorkout = (id: string) => {
    const updated = pastWorkouts.filter((workout) => workout.id !== id);
    setPastWorkouts(updated);
    localStorage.setItem("fitnessWorkouts", JSON.stringify(updated));
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalWorkouts = pastWorkouts.length;
    const totalCalories = pastWorkouts.reduce((sum, workout) => {
      const cal = parseInt(workout.calories);
      return sum + (isNaN(cal) ? 0 : cal);
    }, 0);
    const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0;
    return { totalWorkouts, totalCalories, avgCalories };
  };

  // Filter workouts
  const filteredWorkouts = pastWorkouts.filter((workout) =>
    workout.workoutType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = calculateStats();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/calculate-calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutType,
          duration: parseInt(duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate calories");
      }

      setResult(data.result);
      
      // Extract calories number from result (format: "Calories: 430. ...")
      const caloriesMatch = data.result.match(/Calories:\s*(\d+)/i);
      const calories = caloriesMatch ? caloriesMatch[1] : "N/A";
      
      // Save workout to localStorage
      saveWorkout({
        date,
        workoutType,
        duration: parseInt(duration),
        calories,
        result: data.result,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Fitness Tracker</h1>
        <p className="text-gray-600 mb-8">Track your workouts and calculate calories burned</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="workout" className="block text-sm font-medium text-gray-700 mb-2">
              What workout did you do?
            </label>
            <input
              type="text"
              id="workout"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              placeholder="e.g., Running, Weightlifting, Yoga, Cycling..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 30"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Calculating..." : "Calculate Calories"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-red-800">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (() => {
          const caloriesMatch = result.match(/Calories:\s*(\d+)/i);
          const calories = caloriesMatch ? caloriesMatch[1] : null;
          const explanation = result.replace(/Calories:\s*\d+/i, "").trim();
          
          return (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Result</h2>
              {calories && (
                <div className="mb-4 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Calories Burned</p>
                  <p className="text-4xl font-bold text-indigo-600">{calories}</p>
                </div>
              )}
              {explanation && (
                <p className="text-gray-700">{explanation}</p>
              )}
            </div>
          );
        })()}

        {pastWorkouts.length > 0 && (
          <>
            {/* Statistics Dashboard */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Statistics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{stats.totalWorkouts}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Workouts</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{stats.totalCalories}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Calories</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">{stats.avgCalories}</p>
                  <p className="text-sm text-gray-600 mt-1">Avg Calories</p>
                </div>
              </div>
            </div>

            {/* Past Workouts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Past Workouts</h2>
                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {filteredWorkouts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {searchTerm ? "No workouts found matching your search." : "No workouts yet."}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors relative"
                    >
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                        title="Delete workout"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="flex justify-between items-start mb-2 pr-8">
                        <div>
                          <h3 className="font-semibold text-gray-800">{workout.workoutType}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(workout.date).toLocaleDateString()} • {workout.duration} min
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{workout.calories} cal</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{workout.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
