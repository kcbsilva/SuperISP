// src/components/setup-wizard/StepProgressBar.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface StepProgressBarProps {
  currentStep: number
  labels: string[]
}

export function StepProgressBar({ currentStep, labels }: StepProgressBarProps) {
  return (
    <div className="py-8 px-6 bg-[#081124] rounded-t-lg">
      <h2 className="text-xl font-bold text-white text-center mb-6">Setup Wizard</h2>
      <div className="flex items-center justify-between relative">
        {labels.map((label, index) => {
          const isCompleted = index < currentStep - 1
          const isActive = index === currentStep - 1
          const isFuture = index >= currentStep

          return (
            <div key={label} className="flex-1 flex flex-col items-center relative">
              {/* Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center z-10',
                  isCompleted && 'bg-[#FCA311] border-[#FCA311] text-black',
                  isActive && 'bg-white border-[#FCA311] text-[#FCA311]',
                  isFuture && 'bg-[#081124] border-[#233B6E] text-[#E5E5E5]'
                )}
              >
                {isCompleted ? '✔' : index + 1}
              </div>

              {/* Label */}
              <div
                className={cn(
                  'text-sm mt-2 text-center',
                  isCompleted || isActive
                    ? 'text-[#FCA311]'
                    : 'text-[#E5E5E5]'
                )}
              >
                {label}
              </div>

              {/* Line */}
              {index < labels.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-1/2 w-full h-0.5 z-0',
                    index < currentStep - 1 ? 'bg-[#FCA311]' : 'bg-[#233B6E]'
                  )}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
