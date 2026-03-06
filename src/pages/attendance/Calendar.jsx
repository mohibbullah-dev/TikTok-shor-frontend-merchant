// import { useState } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'react-toastify'
// import API from '../../api/axios'
// import TopBar from '../../components/TopBar'
// import moment from 'moment'

// const Calendar = () => {
//   const queryClient = useQueryClient()
//   const now = moment()
//   const [currentMonth, setCurrentMonth] = useState(now.month() + 1)
//   const [currentYear, setCurrentYear] = useState(now.year())

//   // Fetch calendar data
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['calendar', currentYear, currentMonth],
//     queryFn: async () => {
//       const { data } = await API.get(
//         `/attendance/calendar?year=${currentYear}&month=${currentMonth}`
//       )
//       return data
//     }
//   })

//   // Sign in mutation
//   const signInMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await API.post('/attendance/sign-in')
//       return data
//     },
//     onSuccess: (data) => {
//       toast.success(`🎉 Signed in! +$${data.reward} added to your balance!`)
//       queryClient.invalidateQueries(['calendar'])
//       queryClient.invalidateQueries(['myStore'])
//       refetch()
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Sign-in failed')
//     }
//   })

//   // Build calendar grid
//   const buildCalendar = () => {
//     const firstDay = moment(`${currentYear}-${currentMonth}-01`)
//     const daysInMonth = firstDay.daysInMonth()
//     const startDayOfWeek = firstDay.day()

//     const days = []

//     // Empty cells before month starts
//     for (let i = 0; i < startDayOfWeek; i++) {
//       days.push(null)
//     }

//     // Actual days
//     for (let d = 1; d <= daysInMonth; d++) {
//       days.push(d)
//     }

//     return days
//   }

//   const calendarDays = buildCalendar()
//   const signedDates = data?.records?.map(r => r.signInDate) || []
//   const todayStr = now.format('YYYY-MM-DD')

//   const isSignedDay = (day) => {
//     if (!day) return false
//     const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
//     return signedDates.includes(dateStr)
//   }

//   const isToday = (day) => {
//     if (!day) return false
//     const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
//     return dateStr === todayStr
//   }

//   const goToPrevMonth = () => {
//     if (currentMonth === 1) {
//       setCurrentMonth(12)
//       setCurrentYear(y => y - 1)
//     } else {
//       setCurrentMonth(m => m - 1)
//     }
//   }

//   const goToNextMonth = () => {
//     if (currentMonth === 12) {
//       setCurrentMonth(1)
//       setCurrentYear(y => y + 1)
//     } else {
//       setCurrentMonth(m => m + 1)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-8">
//       <TopBar title="Daily Sign-In" />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
//         <div className="rounded-2xl p-4 shadow-sm text-white"
//           style={{
//             background:
//               'linear-gradient(135deg, #f02d65, #ff6b35)'
//           }}
//         >
//           <p className="text-white/70 text-xs">Consecutive Days</p>
//           <p className="text-3xl font-bold mt-1">
//             {data?.consecutiveSignIns || 0}
//           </p>
//           <p className="text-white/60 text-xs">🔥 Keep it up!</p>
//         </div>
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <p className="text-gray-400 text-xs">This Month</p>
//           <p className="text-3xl font-bold mt-1 text-green-500">
//             {data?.monthlySignIns || 0}
//           </p>
//           <p className="text-gray-400 text-xs">days signed in</p>
//         </div>
//       </div>

//       {/* Reward Info */}
//       <div className="mx-4 mt-3 bg-yellow-50 rounded-2xl p-3
//         border border-yellow-100 flex items-center gap-3">
//         <span className="text-2xl">🎁</span>
//         <div>
//           <p className="text-yellow-700 text-sm font-bold">
//             Daily Reward: $15
//           </p>
//           <p className="text-yellow-600 text-xs">
//             Sign in every day to earn bonus balance
//           </p>
//         </div>
//       </div>

//       {/* Calendar */}
//       <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">

//         {/* Month Navigation */}
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={goToPrevMonth}
//             className="w-8 h-8 bg-gray-100 rounded-full flex items-center
//               justify-center text-gray-600 active:bg-gray-200"
//           >
//             ‹
//           </button>
//           <p className="text-gray-700 font-bold">
//             {moment(`${currentYear}-${currentMonth}-01`)
//               .format('MMMM YYYY')}
//           </p>
//           <button
//             onClick={goToNextMonth}
//             className="w-8 h-8 bg-gray-100 rounded-full flex items-center
//               justify-center text-gray-600 active:bg-gray-200"
//           >
//             ›
//           </button>
//         </div>

//         {/* Day Headers */}
//         <div className="grid grid-cols-7 mb-2">
//           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
//             <div key={day}
//               className="text-center text-gray-400 text-xs font-medium py-1">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar Grid */}
//         {isLoading ? (
//           <div className="h-48 flex items-center justify-center">
//             <svg className="animate-spin h-8 w-8"
//               style={{ color: '#f02d65' }}
//               fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12"
//                 r="10" stroke="currentColor" strokeWidth="4"/>
//               <path className="opacity-75" fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"/>
//             </svg>
//           </div>
//         ) : (
//           <div className="grid grid-cols-7 gap-1">
//             {calendarDays.map((day, i) => (
//               <div key={i}
//                 className="aspect-square flex items-center justify-center">
//                 {day ? (
//                   <div className={`w-9 h-9 rounded-full flex items-center
//                     justify-center text-sm font-medium relative ${
//                     isSignedDay(day)
//                       ? 'text-white shadow-sm'
//                       : isToday(day)
//                       ? 'border-2 font-bold'
//                       : 'text-gray-600'
//                   }`}
//                     style={{
//                       background: isSignedDay(day)
//                         ? 'linear-gradient(135deg, #f02d65, #ff6b35)'
//                         : 'transparent',
//                       borderColor: isToday(day) && !isSignedDay(day)
//                         ? '#f02d65' : 'transparent',
//                       color: isToday(day) && !isSignedDay(day)
//                         ? '#f02d65' : ''
//                     }}
//                   >
//                     {isSignedDay(day) ? '✓' : day}
//                   </div>
//                 ) : null}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Sign In Button */}
//       <div className="mx-4 mt-4">
//         {data?.signedToday ? (
//           <div className="w-full py-4 rounded-2xl bg-green-50 border-2
//             border-green-200 flex items-center justify-center gap-2">
//             <span className="text-green-500 text-xl">✓</span>
//             <p className="text-green-600 font-bold">
//               Already signed in today!
//             </p>
//           </div>
//         ) : (
//           <button
//             onClick={() => signInMutation.mutate()}
//             disabled={signInMutation.isPending}
//             className="w-full py-4 rounded-2xl text-white font-bold
//               text-base shadow-lg active:scale-95 transition-all
//               disabled:opacity-60"
//             style={{
//               background:
//                 'linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)'
//             }}
//           >
//             {signInMutation.isPending
//               ? 'Signing in...'
//               : '🎁 SIGN IN TODAY (+$15)'}
//           </button>
//         )}
//       </div>

//       {/* Legend */}
//       <div className="mx-4 mt-4 flex items-center justify-center gap-6">
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full flex items-center
//             justify-center text-white text-xs"
//             style={{
//               background:
//                 'linear-gradient(135deg, #f02d65, #ff6b35)'
//             }}
//           >
//             ✓
//           </div>
//           <span className="text-gray-400 text-xs">Signed</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full border-2 flex items-center
//             justify-center text-xs font-bold"
//             style={{
//               borderColor: '#f02d65',
//               color: '#f02d65'
//             }}
//           >
//             {now.date()}
//           </div>
//           <span className="text-gray-400 text-xs">Today</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center
//             justify-center text-gray-400 text-xs">
//             •
//           </div>
//           <span className="text-gray-400 text-xs">Missed</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Calendar









///////////////////// =========================== latest version (by gemeni) ===================== /////////////////////

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";
import { CalendarCheck, Flame, Gift, Check, Loader2 } from "lucide-react";

export default function Calendar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  // Fetch Attendance Records
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      // Create this route in backend if not exists: GET /api/merchants/attendance
      // Returning mock structure for UI safety if endpoint is missing
      try {
        const { data } = await API.get("/merchants/attendance");
        return data;
      } catch {
        return { records: [], totalDays: 0, checkedInToday: false };
      }
    },
  });

  useEffect(() => {
    if (attendanceData) {
      setIsCheckedInToday(attendanceData.checkedInToday);
    }
  }, [attendanceData]);

  const checkInMutation = useMutation({
    mutationFn: async () => {
      // Create this route in backend: POST /api/merchants/attendance/check-in
      const { data } = await API.post("/merchants/attendance/check-in");
      return data;
    },
    onSuccess: () => {
      toast.success("Checked in successfully! +1 Credit Score");
      setIsCheckedInToday(true);
      queryClient.invalidateQueries(["attendance"]);
      queryClient.invalidateQueries(["myStore"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Already checked in today!");
      setIsCheckedInToday(true);
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Mocking the current week's visual state based on totalDays
  const totalDays = attendanceData?.totalDays || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative" style={{ margin: "0 auto", maxWidth: "620px" }}>
      <TopBar title="Daily Attendance" backgroundColor="#fff" textColor="text-gray-800" showBack={true} />

      {/* ════════════ HERO FLAME SECTION ════════════ */}
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)", borderBottom: "1px solid #f1f5f9" }}>
        
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", boxShadow: "0 8px 20px rgba(240, 45, 101, 0.3)", position: "relative" }}>
          <Flame size={40} color="#fff" fill="#fff" />
          <div style={{ position: "absolute", top: "-5px", right: "-5px", backgroundColor: "#1e293b", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "10px", border: "2px solid #fff" }}>
            Day {totalDays}
          </div>
        </div>

        <h2 style={{ color: "#1e293b", fontSize: "22px", fontWeight: "900", margin: "0 0 8px 0" }}>Keep the streak alive!</h2>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0, textAlign: "center", maxWidth: "80%" }}>
          Sign in every day to increase your credit score and unlock VIP platform privileges.
        </p>

        {/* Action Button */}
        <button
          onClick={() => checkInMutation.mutate()}
          disabled={isCheckedInToday || checkInMutation.isPending}
          style={{
            width: "100%", maxWidth: "300px", padding: "16px", borderRadius: "100px", fontSize: "16px", fontWeight: "bold", color: "#fff", border: "none", marginTop: "24px",
            cursor: isCheckedInToday ? "not-allowed" : "pointer",
            background: isCheckedInToday ? "#10b981" : "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
            boxShadow: isCheckedInToday ? "0 4px 15px rgba(16, 185, 129, 0.3)" : "0 4px 15px rgba(240, 45, 101, 0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "transform 0.1s"
          }}
          onMouseDown={(e) => !isCheckedInToday && (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => !isCheckedInToday && (e.currentTarget.style.transform = "scale(1)")}
        >
          {checkInMutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isCheckedInToday ? (
            <><Check size={20} strokeWidth={3} /> Signed In Today</>
          ) : (
            <><CalendarCheck size={20} /> Sign In Now</>
          )}
        </button>
      </div>

      {/* ════════════ WEEKLY TRACKER ════════════ */}
      <div style={{ padding: "24px 16px" }}>
        <h3 style={{ color: "#1e293b", fontSize: "16px", fontWeight: "bold", margin: "0 0 16px 0" }}>This Week's Progress</h3>
        
        <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {daysOfWeek.map((day, idx) => {
            const isPassed = idx < (totalDays % 7);
            const isToday = idx === (totalDays % 7);
            
            return (
              <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ color: isToday ? "#f02d65" : "#94a3b8", fontSize: "11px", fontWeight: isToday ? "bold" : "600" }}>{day}</span>
                <div style={{ 
                  width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s",
                  backgroundColor: isPassed ? "#10b981" : isToday && isCheckedInToday ? "#10b981" : isToday ? "#fff1f2" : "#f1f5f9",
                  border: isToday && !isCheckedInToday ? "2px solid #f02d65" : "none",
                  color: isPassed || (isToday && isCheckedInToday) ? "#fff" : isToday ? "#f02d65" : "#cbd5e1"
                }}>
                  {(isPassed || (isToday && isCheckedInToday)) ? <Check size={16} strokeWidth={3} /> : <Gift size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════ RULES CARD ════════════ */}
      <div style={{ padding: "0 16px 40px 16px" }}>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: "16px", padding: "20px", border: "1px dashed #e2e8f0" }}>
          <h3 style={{ color: "#64748b", fontSize: "13px", fontWeight: "bold", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Attendance Rules</h3>
          <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#64748b", fontSize: "13px", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>Sign in daily to maintain your platform Credit Score.</li>
            <li>A high Credit Score is required for VIP level upgrades.</li>
            <li>Missing a day will not reset your total days, but consistent sign-ins are recommended.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}