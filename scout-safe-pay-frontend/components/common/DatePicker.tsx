'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  isRange?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  isRange = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateSelect = (date: Date) => {
    if (isRange) {
      if (!rangeStart) {
        setRangeStart(date);
      } else if (!rangeEnd) {
        if (date > rangeStart) {
          setRangeEnd(date);
          onChange?.(date);
          setIsOpen(false);
        } else {
          setRangeStart(date);
          setRangeEnd(null);
        }
      } else {
        setRangeStart(date);
        setRangeEnd(null);
      }
    } else {
      onChange?.(date);
      setIsOpen(false);
    }
  };

  const isDisabledDate = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const displayText = isRange
    ? rangeStart && rangeEnd
      ? `${format(rangeStart, 'MMM d')} - ${format(rangeEnd, 'MMM d')}`
      : rangeStart
      ? format(rangeStart, 'MMM d')
      : placeholder
    : value
    ? format(value, 'MMM d, yyyy')
    : placeholder;

  return (
    <div className="relative w-full">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-as24-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
      >
        <span className={value || rangeStart ? 'text-gray-900' : 'text-gray-500'}>
          {displayText}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-96"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const isDisabled = isDisabledDate(day);
                const isSelected = value && format(day, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd');
                const isRangeStart = rangeStart && format(day, 'yyyy-MM-dd') === format(rangeStart, 'yyyy-MM-dd');
                const isRangeEnd = rangeEnd && format(day, 'yyyy-MM-dd') === format(rangeEnd, 'yyyy-MM-dd');
                const isInRange = rangeStart && rangeEnd && day > rangeStart && day < rangeEnd;

                return (
                  <button
                    key={format(day, 'yyyy-MM-dd')}
                    onClick={() => !isDisabled && handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`p-2 text-sm font-medium rounded-lg transition ${
                      isSelected || isRangeStart || isRangeEnd
                        ? 'bg-as24-blue text-white'
                        : isInRange
                        ? 'bg-as24-blue/20 text-gray-900'
                        : isToday(day)
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : !isSameMonth(day, currentMonth)
                        ? 'text-gray-300'
                        : 'text-gray-900 hover:bg-gray-100'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Range Info */}
            {isRange && rangeStart && !rangeEnd && (
              <div className="mt-4 text-sm text-gray-600">
                Start: {format(rangeStart, 'MMM d, yyyy')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DatePicker;
