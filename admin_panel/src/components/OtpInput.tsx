import React, { useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      if (newValue[index]) {
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        focusInput(index - 1);
        const prevValue = value.split('');
        prevValue[index - 1] = '';
        onChange(prevValue.join(''));
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let char = e.target.value;
    // Sanitize: only allow numbers
    char = char.replace(/\D/g, '').slice(-1);

    if (char) {
      const newValue = value.split('');
      newValue[index] = char;
      onChange(newValue.join(''));
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedText) {
      const newValue = pastedText.padEnd(length, '').slice(0, length);
      onChange(newValue);
      
      const nextIndex = Math.min(pastedText.length, length - 1);
      focusInput(nextIndex);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={2}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B] outline-none transition-all text-gray-900 bg-gray-50"
        />
      ))}
    </div>
  );
};

export default OtpInput;
