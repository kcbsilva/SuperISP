// src/components/finances/dashboard/views/FinanceDashboard.tsx
'use client'

import React, { useEffect, useState } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { widgets } from '../widgets'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export default function FinanceDashboard() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const [period, setPeriod] = useState('last_30_days')
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(widgets.map(w => w.key))
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-editing')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [layout, setLayout] = useState<Layout[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finance-layout')
      return saved ? JSON.parse(saved) : widgets.map((w, i) => ({
        i: w.key,
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * 2,
        w: 3,
        h: 2,
      }))
    }
    return widgets.map((w, i) => ({
      i: w.key,
      x: (i * 2) % 12,
      y: Math.floor(i / 6) * 2,
      w: 3,
      h: 2,
    }))
  })

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout)
    localStorage.setItem('finance-layout', JSON.stringify(newLayout))
  }

  if (!hydrated) return <div className="p-4 text-muted-foreground">Loading dashboard...</div>

  return (
    <div className="p-4 space-y-4 bg-muted min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Finance Dashboard</h1>

          {/* Add Widget Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-xs">+ Add Widget</Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Select Widgets</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {widgets.map(w => (
                  <div key={w.key} className="flex items-center gap-2">
                    <Checkbox
                      id={w.key}
                      checked={visibleWidgets.includes(w.key)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setVisibleWidgets([...visibleWidgets, w.key])
                        } else {
                          setVisibleWidgets(visibleWidgets.filter(k => k !== w.key))
                        }
                      }}
                    />
                    <label htmlFor={w.key} className="text-sm">{w.key}</label>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={() => setIsEditing(prev => !prev)}>
            {isEditing ? 'Finish Editing' : 'Edit Layout'}
          </Button>
        </div>

        {/* Period Filter */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid Layout */}
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={100}
        width={1200}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={onLayoutChange}
        preventCollision
        compactType={null}
      >
        {widgets
          .filter(w => visibleWidgets.includes(w.key))
          .map(w => (
            <div key={w.key} className="w-full h-full p-2">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-xl p-4 shadow">
                <w.component period={period} />
              </div>
            </div>
          ))}
      </GridLayout>
    </div>
  )
}
