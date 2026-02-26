import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import API from '../../api/axios'
import TopBar from '../../components/TopBar'

const USDT_ADDRESS = 'TJK8RbKzFhJPY4oPqL9XmA3sN7gWqY2dV5'

const WalletRecharge = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'usdt'
  const isUSDT = type === 'usdt'

  const [amount, setAmount] = useState('')
  const [voucher, setVoucher] = useState('')
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000]

  // Copy wallet address
  const handleCopy = () => {
    navigator.clipboard.writeText(USDT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Address copied!')
  }

  // Upload voucher image
  const handleVoucherUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await API.post(
        '/upload/single?folder=recharge-vouchers',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setVoucher(data.url)
      toast.success('Screenshot uploaded!')
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Submit recharge
  const rechargeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.post('/recharge', {
        price: Number(amount),
        rechargeType: isUSDT ? 'USDT' : 'bank',
        currencyType: 'USD',
        voucher
      })
      return data
    },
    onSuccess: () => {
      toast.success('Recharge request submitted! Awaiting review.')
      navigate('/funds')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed')
    }
  })

  const handleSubmit = () => {
    if (!amount || Number(amount) < 100) {
      toast.error('Minimum recharge amount is $100')
      return
    }
    if (!voucher) {
      toast.error('Please upload payment screenshot')
      return
    }
    rechargeMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <TopBar title={isUSDT ? 'USDT Recharge' : 'Bank Transfer'} />

      {isUSDT ? (
        <>
          {/* USDT Address Card */}
          <div className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center
                justify-center text-white font-bold text-sm"
                style={{ background: '#26a17b' }}
              >
                ₮
              </div>
              <p className="text-gray-700 font-bold">
                USDT - TRC20 Network
              </p>
            </div>

            {/* QR Code placeholder */}
            <div className="w-40 h-40 mx-auto bg-gray-100 rounded-2xl
              flex items-center justify-center mb-4 border-2
              border-dashed border-gray-200">
              <div className="text-center">
                <span className="text-4xl">📱</span>
                <p className="text-gray-400 text-xs mt-1">QR Code</p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-gray-400 text-xs mb-1">
                Wallet Address (TRC20)
              </p>
              <p className="text-gray-700 text-xs font-mono break-all
                leading-relaxed">
                {USDT_ADDRESS}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl font-bold text-sm
                text-white active:scale-95 transition-all"
              style={{
                background: copied
                  ? '#22c55e'
                  : 'linear-gradient(135deg, #26a17b, #1a7a5e)'
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Address'}
            </button>
          </div>

          {/* Warning */}
          <div className="mx-4 mt-3 p-3 bg-red-50 rounded-xl
            border border-red-100">
            <p className="text-red-500 text-xs font-bold">
              ⚠️ Only send USDT via TRC20 network!
            </p>
            <p className="text-red-400 text-xs mt-0.5">
              Sending via other networks will result in permanent loss
            </p>
          </div>
        </>
      ) : (
        // Bank Transfer Info
        <div className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-gray-700 font-bold mb-4">
            Bank Transfer Details
          </p>
          {[
            { label: 'Bank Name', value: 'International Commerce Bank' },
            { label: 'Account Name', value: 'TikTok Shop Platform' },
            { label: 'Account Number', value: '8847 2291 0033 4421' },
            { label: 'Routing Number', value: '021000021' },
            { label: 'Reference', value: 'DEPOSIT-MERCHANT' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center
              py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-400 text-sm">{item.label}</span>
              <span className="text-gray-700 text-sm font-bold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Amount Selection */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">
          Recharge Amount (USD)
        </p>

        {/* Quick amounts */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(String(amt))}
              className="py-2.5 rounded-xl text-sm font-bold
                border-2 transition-all active:scale-95"
              style={{
                borderColor: amount === String(amt) ? '#f02d65' : '#f3f4f6',
                background: amount === String(amt) ? '#fff0f3' : '#f9fafb',
                color: amount === String(amt) ? '#f02d65' : '#6b7280'
              }}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2
            text-gray-400 font-bold">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter custom amount"
            className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-2
              border-gray-200 rounded-xl text-sm font-bold outline-none
              focus:border-pink-400 transition-all"
          />
        </div>
      </div>

      {/* Upload Voucher */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-gray-700 font-bold text-sm mb-3">
          Upload Payment Screenshot
        </p>

        {voucher ? (
          <div className="relative">
            <img src={voucher} alt="voucher"
              className="w-full h-48 object-cover rounded-xl"/>
            <button
              onClick={() => setVoucher('')}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500
                rounded-full text-white text-sm flex items-center
                justify-center shadow-lg"
            >
              ×
            </button>
            <div className="mt-2 flex items-center gap-2 text-green-500">
              <span>✓</span>
              <span className="text-xs font-medium">
                Screenshot uploaded
              </span>
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="h-36 border-2 border-dashed border-gray-200
              rounded-xl flex flex-col items-center justify-center
              bg-gray-50 active:bg-gray-100 transition-all">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="animate-spin h-8 w-8"
                    style={{ color: '#f02d65' }}
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12"
                      r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <p className="text-gray-400 text-xs">Uploading...</p>
                </div>
              ) : (
                <>
                  <span className="text-4xl mb-2">📸</span>
                  <p className="text-gray-500 text-sm font-medium">
                    Tap to upload screenshot
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    JPG, PNG (max 5MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleVoucherUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2
        w-full max-w-[480px] bg-white border-t border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-sm">Amount:</span>
          <span className="font-bold text-lg"
            style={{ color: '#f02d65' }}>
            ${amount ? Number(amount).toLocaleString() : '0.00'}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={rechargeMutation.isPending || uploading}
          className="w-full py-4 rounded-xl text-white font-bold
            text-base shadow-lg active:scale-95 transition-all
            disabled:opacity-60"
          style={{
            background:
              'linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)'
          }}
        >
          {rechargeMutation.isPending
            ? 'Submitting...'
            : 'SUBMIT RECHARGE REQUEST'}
        </button>
      </div>
    </div>
  )
}

export default WalletRecharge