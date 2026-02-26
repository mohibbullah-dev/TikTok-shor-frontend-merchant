import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import API from '../../api/axios'
import TopBar from '../../components/TopBar'
import moment from 'moment'

const Calendar = () => {
  const queryClient = useQueryClient()
  const now = moment()
  const [currentMonth, setCurrentMonth] = useState(now.month() + 1)
  const [currentYear, setCurrentYear] = useState(now.year())

  // Fetch calendar data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['calendar', currentYear, currentMonth],
    queryFn: async () => {
      const { data } = await API.get(
        `/attendance/calendar?year=${currentYear}&month=${currentMonth}`
      )
      return data
    }
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post('/attendance/sign-in')
      return data
    },
    onSuccess: (data) => {
      toast.success(`🎉 Signed in! +$${data.reward} added to your balance!`)
      queryClient.invalidateQueries(['calendar'])
      queryClient.invalidateQueries(['myStore'])
      refetch()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Sign-in failed')
    }
  })

  // Build calendar grid
  const buildCalendar = () => {
    const firstDay = moment(`${currentYear}-${currentMonth}-01`)
    const daysInMonth = firstDay.daysInMonth()
    const startDayOfWeek = firstDay.day()

    const days = []

    // Empty cells before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d)
    }

    return days
  }

  const calendarDays = buildCalendar()
  const signedDates = data?.records?.map(r => r.signInDate) || []
  const todayStr = now.format('YYYY-MM-DD')

  const isSignedDay = (day) => {
    if (!day) return false
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return signedDates.includes(dateStr)
  }

  const isToday = (day) => {
    if (!day) return false
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr === todayStr
  }

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopBar title="Daily Sign-In" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
        <div className="rounded-2xl p-4 shadow-sm text-white"
          style={{
            background:
              'linear-gradient(135deg, #f02d65, #ff6b35)'
          }}
        >
          <p className="text-white/70 text-xs">Consecutive Days</p>
          <p className="text-3xl font-bold mt-1">
            {data?.consecutiveSignIns || 0}
          </p>
          <p className="text-white/60 text-xs">🔥 Keep it up!</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-400 text-xs">This Month</p>
          <p className="text-3xl font-bold mt-1 text-green-500">
            {data?.monthlySignIns || 0}
          </p>
          <p className="text-gray-400 text-xs">days signed in</p>
        </div>
      </div>

      {/* Reward Info */}
      <div className="mx-4 mt-3 bg-yellow-50 rounded-2xl p-3
        border border-yellow-100 flex items-center gap-3">
        <span className="text-2xl">🎁</span>
        <div>
          <p className="text-yellow-700 text-sm font-bold">
            Daily Reward: $15
          </p>
          <p className="text-yellow-600 text-xs">
            Sign in every day to earn bonus balance
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center text-gray-600 active:bg-gray-200"
          >
            ‹
          </button>
          <p className="text-gray-700 font-bold">
            {moment(`${currentYear}-${currentMonth}-01`)
              .format('MMMM YYYY')}
          </p>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center text-gray-600 active:bg-gray-200"
          >
            ›
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day}
              className="text-center text-gray-400 text-xs font-medium py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8"
              style={{ color: '#f02d65' }}
              fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12"
                r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div key={i}
                className="aspect-square flex items-center justify-center">
                {day ? (
                  <div className={`w-9 h-9 rounded-full flex items-center
                    justify-center text-sm font-medium relative ${
                    isSignedDay(day)
                      ? 'text-white shadow-sm'
                      : isToday(day)
                      ? 'border-2 font-bold'
                      : 'text-gray-600'
                  }`}
                    style={{
                      background: isSignedDay(day)
                        ? 'linear-gradient(135deg, #f02d65, #ff6b35)'
                        : 'transparent',
                      borderColor: isToday(day) && !isSignedDay(day)
                        ? '#f02d65' : 'transparent',
                      color: isToday(day) && !isSignedDay(day)
                        ? '#f02d65' : ''
                    }}
                  >
                    {isSignedDay(day) ? '✓' : day}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign In Button */}
      <div className="mx-4 mt-4">
        {data?.signedToday ? (
          <div className="w-full py-4 rounded-2xl bg-green-50 border-2
            border-green-200 flex items-center justify-center gap-2">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-green-600 font-bold">
              Already signed in today!
            </p>
          </div>
        ) : (
          <button
            onClick={() => signInMutation.mutate()}
            disabled={signInMutation.isPending}
            className="w-full py-4 rounded-2xl text-white font-bold
              text-base shadow-lg active:scale-95 transition-all
              disabled:opacity-60"
            style={{
              background:
                'linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)'
            }}
          >
            {signInMutation.isPending
              ? 'Signing in...'
              : '🎁 SIGN IN TODAY (+$15)'}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="mx-4 mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center
            justify-center text-white text-xs"
            style={{
              background:
                'linear-gradient(135deg, #f02d65, #ff6b35)'
            }}
          >
            ✓
          </div>
          <span className="text-gray-400 text-xs">Signed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 flex items-center
            justify-center text-xs font-bold"
            style={{
              borderColor: '#f02d65',
              color: '#f02d65'
            }}
          >
            {now.date()}
          </div>
          <span className="text-gray-400 text-xs">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center
            justify-center text-gray-400 text-xs">
            •
          </div>
          <span className="text-gray-400 text-xs">Missed</span>
        </div>
      </div>
    </div>
  )
}

export default Calendar