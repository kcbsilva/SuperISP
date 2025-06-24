// /src/app/admin/messenger/flow/[flowId]/edit/page.tsx
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Loader2 } from 'lucide-react';
import {
  MessageNode,
  ConditionNode,
  DelayNode,
  ActionNode,
  WebhookNode,
  EmailNode,
} from '@/components/flow/nodes/MessageNode';
import { FlowToolbox } from '@/components/flow/FlowToolbox';

const nodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  delay: DelayNode,
  action: ActionNode,
  webhook: WebhookNode,
  email: EmailNode,
};

interface FlowStepOption {
  keyword: string;
  next: string;
}

interface FlowStep {
  type?: string;
  message: string;
  options?: FlowStepOption[];
}

interface FlowData {
  [key: string]: FlowStep;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function EditFlowPage() {
  const params = useParams();
  const flowId = params.flowId as string;
  const { toast } = useToast();
  const { t } = useLocale();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleNodeUpdate = React.useCallback((id: string, newMessage: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, message: newMessage } } : node
      )
    );
  }, [setNodes]);

  const handleNodeDelete = React.useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  React.useEffect(() => {
    const fetchFlow = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/flow/${flowId}`);
        if (!response.ok) throw new Error('Failed to fetch flow');
        const data: FlowData = await response.json();
        const converted = convertFlowToGraph(data, handleNodeUpdate, handleNodeDelete);
        setNodes(converted.nodes);
        setEdges(converted.edges);
      } catch (error) {
        toast({ title: 'Error loading flow', description: (error as Error).message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    if (flowId) fetchFlow();
  }, [flowId, toast, setNodes, setEdges, handleNodeUpdate, handleNodeDelete]);

  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: type,
        message: 'New node',
        update: handleNodeUpdate,
        onDelete: handleNodeDelete,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, handleNodeUpdate, handleNodeDelete]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex h-full w-full">
      <FlowToolbox />
      <ReactFlowProvider>
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-muted"
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

function convertFlowToGraph(
  flowData: FlowData,
  update: (id: string, msg: string) => void,
  onDelete: (id: string) => void
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yPos = 50;
  let xPos = 50;
  const nodeHorizontalSpacing = 250;
  const nodeVerticalSpacing = 150;
  const nodesPerRow = 3;
  let nodeCountInRow = 0;

  Object.entries(flowData).forEach(([key, step]) => {
    nodes.push({
      id: key,
      type: step.type || 'message',
      data: {
        label: key,
        message: step.message,
        options: step.options || [],
        update,
        onDelete,
      },
      position: { x: xPos, y: yPos },
    });

    nodeCountInRow++;
    if (nodeCountInRow >= nodesPerRow) {
      nodeCountInRow = 0;
      xPos = 50;
      yPos += nodeVerticalSpacing;
    } else {
      xPos += nodeHorizontalSpacing;
    }

    step.options?.forEach(option => {
      if (option.next && option.keyword) {
        edges.push({
          id: `e-${key}-${option.next}-${option.keyword}`,
          source: key,
          target: option.next,
          label: option.keyword,
          type: 'smoothstep',
          animated: true,
        });
      }
    });
  });

  return { nodes, edges };
}