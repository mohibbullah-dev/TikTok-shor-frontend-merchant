import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import { useSelector } from 'react-redux'

const Recharge = () => {
  const navigate = useNavigate()
  const { merchant } = useSelector(state => state.auth)

  const methods = [
    {
      id: 'usdt',
      icon: '₮',
      iconBg: '#26a17b',
      title: 'USDT Recharge',
      subtitle: 'TRC20 / ERC20 Network',
      tag: 'Recommended',
      tagColor: '#22c55e',
      path: '/recharge/wallet?type=usdt'
    },
    {
      id: 'bank',
      icon: '🏦',
      iconBg: '#3b82f6',
      title: 'Bank Transfer',
      subtitle: 'Local bank deposit',
      tag: 'Manual',
      tagColor: '#f59e0b',
      path: '/recharge/wallet?type=bank'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Recharge" />

      {/* Balance Card */}
      <div className="mx-4 mt-4 rounded-2xl p-5 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)'
        }}
      >
        <p className="text-white/70 text-xs mb-1">Current Balance</p>
        <p className="text-white text-3xl font-bold">
          ${(merchant?.balance || 0).toFixed(2)}
        </p>
        <p className="text-white/60 text-xs mt-1">
          Pending: ${(merchant?.pendingAmount || 0).toFixed(2)}
        </p>
      </div>

      {/* Methods */}
      <div className="mx-4 mt-6">
        <p className="text-gray-500 text-xs font-medium mb-3 px-1">
          SELECT RECHARGE METHOD
        </p>
        <div className="space-y-3">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => navigate(method.path)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm
                flex items-center gap-4 active:scale-[0.98]
                transition-all text-left"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center
                justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: method.iconBg }}
              >
                {method.icon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-bold text-sm">
                    {method.title}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full
                    text-white font-medium"
                    style={{ background: method.tagColor }}
                  >
                    {method.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-0.5">
                  {method.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <span className="text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mx-4 mt-6 p-4 bg-yellow-50 rounded-2xl
        border border-yellow-100">
        <p className="text-yellow-700 text-xs font-bold mb-2">
          ⚠️ Important Notes:
        </p>
        <ul className="space-y-1">
          {[
            'Minimum recharge amount: $100',
            'Upload clear screenshot as proof',
            'Processing time: 5-30 minutes',
            'Contact support if not received after 1 hour'
          ].map((note, i) => (
            <li key={i} className="text-yellow-600 text-xs flex gap-1.5">
              <span>•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* History link */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => navigate('/funds?filter=recharge')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm
            flex items-center justify-between active:scale-[0.98]
            transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <span className="text-gray-700 text-sm font-medium">
              Recharge History
            </span>
          </div>
          <span className="text-gray-300 text-lg">›</span>
        </button>
      </div>
    </div>
  )
}

export default Recharge