// /src/components/flow/nodes/ActionNode.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Input } from '@/components/ui/input';

export function ActionNode({ id, data }: NodeProps) {
  return (
    <div className="rounded-md border border-purple-300 bg-purple-50 shadow-sm">
      <Card className="w-64 bg-purple-50">
        <CardHeader className="flex flex-row items-center gap-2 text-purple-700 text-sm">
          <Zap className="h-4 w-4" />
          <span>Action</span>
        </CardHeader>
        <CardContent>
          <Input
            className="text-xs"
            value={data.message}
            onChange={(e) => data.update(id, e.target.value)}
            placeholder="Action description"
          />
        </CardContent>
      </Card>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-purple-600" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-purple-600" />
    </div>
  );
}