// /src/components/flow/nodes/NodeWrapper.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, Move } from 'lucide-react';
import { Handle, Position } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export interface NodeWrapperProps {
  id: string;
  data: any;
  selected: boolean;
  color: string;
  icon: JSX.Element;
  title: string;
}

export function NodeWrapper({ id, data, selected, color, icon, title }: NodeWrapperProps) {
  return (
    <div
      className={cn(
        `rounded-md border border-${color}-300 bg-${color}-50 shadow-sm`,
        selected && `ring-2 ring-${color}-500`
      )}
    >
      <Card className={`w-64 bg-${color}-50`}>
        <CardHeader
          className={`flex flex-row items-center justify-between gap-2 text-${color}-700 text-sm`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 cursor-move"
              title="Drag"
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-destructive"
              title="Delete"
              onClick={() => data.onDelete?.(id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Input
            className="text-xs"
            value={data.message}
            onChange={(e) => data.update(id, e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} content`}
          />
        </CardContent>
      </Card>
      <Handle
        type="target"
        position={Position.Top}
        className={`w-2 h-2 bg-${color}-600`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-2 h-2 bg-${color}-600`}
      />
    </div>
  );
}
