// /src/components/flow/nodes/ConditionNode.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Input } from '@/components/ui/input';

export function ConditionNode({ id, data, selected }: NodeProps) {
  return (
    <div className="rounded-md border border-blue-300 bg-blue-50 shadow-sm">
      <Card className="w-64 bg-blue-50">
        <CardHeader className="flex flex-row items-center gap-2 text-blue-700 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Condition</span>
        </CardHeader>
        <CardContent>
          <Input
            className="text-xs"
            value={data.message}
            onChange={(e) => data.update(id, e.target.value)}
            placeholder="Condition expression"
          />
        </CardContent>
      </Card>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-600" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-600" />
    </div>
  );
}