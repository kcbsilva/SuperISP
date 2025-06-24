// /src/components/flow/nodes/DelayNode.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Input } from '@/components/ui/input';

export function DelayNode({ id, data }: NodeProps) {
  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 shadow-sm">
      <Card className="w-64 bg-yellow-50">
        <CardHeader className="flex flex-row items-center gap-2 text-yellow-700 text-sm">
          <Clock className="h-4 w-4" />
          <span>Delay</span>
        </CardHeader>
        <CardContent>
          <Input
            className="text-xs"
            value={data.message}
            onChange={(e) => data.update(id, e.target.value)}
            placeholder="e.g. 5s, 2m"
          />
        </CardContent>
      </Card>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-yellow-600" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-yellow-600" />
    </div>
  );
}