import { useRef, KeyboardEvent } from 'react'

interface OtpInputProps {
  value: string
  onChange: (val: string) => void
}

/**
 * 6-box OTP input — auto-focus next box, backspace goes back
 */
export default function OtpInput({ value, onChange }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    arr[index] = digit
    const newVal = arr.join('').slice(0, 6)
    onChange(newVal)
    if (digit && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-full aspect-square text-center font-display font-semibold text-xl text-ink 
            bg-white border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10
            ${value[i] ? 'border-navy' : 'border-stone'}`}
        />
      ))}
    </div>
  )
}
