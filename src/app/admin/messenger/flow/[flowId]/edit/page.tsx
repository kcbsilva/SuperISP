// src/app/admin/messenger/flow/[flowId]/edit/page.tsx
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
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Plus, Trash2, Workflow } from 'lucide-react';

interface FlowStepOption {
  keyword: string;
  next: string;
}

interface FlowStep {
  message: string;
  options?: FlowStepOption[];
}

interface FlowData {
  [key: string]: FlowStep;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const convertFlowToGraph = (flowData: FlowData) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let yPos = 0;

  Object.keys(flowData).forEach((key, index) => {
    nodes.push({
      id: key,
      type: 'default', // Or a custom node type
      data: { label: key, message: flowData[key].message, options: flowData[key].options || [] },
      position: { x: 250 * (index % 3) , y: yPos }, // Basic layout
    });
    yPos += 150;
    if ((index + 1) % 3 === 0) yPos += 100;


    flowData[key].options?.forEach(option => {
      edges.push({
        id: `e-${key}-${option.next}-${option.keyword}`,
        source: key,
        target: option.next,
        label: option.keyword,
        type: 'smoothstep', // Or 'default'
        animated: true,
      });
    });
  });
  return { nodes, edges };
};

const convertGraphToFlow = (nodes: Node[], edges: Edge[]): FlowData => {
  const flowData: FlowData = {};
  nodes.forEach(node => {
    const step: FlowStep = { message: node.data.message, options: [] };
    // Options are derived from edges originating from this node
    edges.filter(edge => edge.source === node.id).forEach(edge => {
      step.options?.push({ keyword: edge.label as string, next: edge.target });
    });
    if (step.options?.length === 0) delete step.options; // Clean up if no options
    flowData[node.id] = step;
  });
  return flowData;
};


export default function EditFlowPage() {
  const params = useParams();
  const flowId = params.flowId as string;
  const { toast } = useToast();
  const { t } = useLocale();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowData, setFlowData] = React.useState<FlowData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [editMessage, setEditMessage] = React.useState('');
  const [editOptions, setEditOptions] = React.useState<FlowStepOption[]>([]);
  const [newNodeId, setNewNodeId] = React.useState('');


  React.useEffect(() => {
    const fetchFlow = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat/flow');
        if (!response.ok) throw new Error('Failed to fetch flow');
        const data: FlowData = await response.json();
        setFlowData(data);
        const { nodes: initialNodes, edges: initialEdges } = convertFlowToGraph(data);
        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (error) {
        toast({ title: t('messenger_flow.editor_load_error_title'), description: (error as Error).message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    if (flowId) fetchFlow();
  }, [flowId, toast, t, setNodes, setEdges]);

  React.useEffect(() => {
    if (selectedNode) {
      setEditMessage(selectedNode.data.message || '');
      setEditOptions(selectedNode.data.options || []);
    } else {
      setEditMessage('');
      setEditOptions([]);
    }
  }, [selectedNode]);

  const onConnect = React.useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };
  
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  const handleSaveFlow = async () => {
    if (!flowData) return;
    setIsSaving(true);
    const updatedFlowData = convertGraphToFlow(nodes, edges);
    try {
      const response = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlowData),
      });
      if (!response.ok) throw new Error('Failed to save flow');
      toast({ title: t('messenger_flow.editor_save_success_title'), description: t('messenger_flow.editor_save_success_desc') });
      setFlowData(updatedFlowData); // Update local state after successful save
    } catch (error) {
      toast({ title: t('messenger_flow.editor_save_error_title'), description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateSelectedNodeDetails = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: node.id, message: editMessage, options: editOptions } }
          : node
      )
    );
    // Update edges based on new options
    const oldEdges = edges.filter(edge => edge.source !== selectedNode.id);
    const newStepEdges: Edge[] = editOptions.map(opt => ({
        id: `e-${selectedNode.id}-${opt.next}-${opt.keyword}`,
        source: selectedNode.id,
        target: opt.next,
        label: opt.keyword,
        type: 'smoothstep',
        animated: true,
    }));
    setEdges([...oldEdges, ...newStepEdges]);
    toast({ title: t('messenger_flow.editor_node_updated_title'), description: t('messenger_flow.editor_node_updated_desc', '{nodeId} details applied locally.').replace('{nodeId}', selectedNode.id) });
  };

  const handleAddOption = () => {
    setEditOptions([...editOptions, { keyword: '', next: '' }]);
  };

  const handleOptionChange = (index: number, field: keyof FlowStepOption, value: string) => {
    const newOptions = [...editOptions];
    newOptions[index][field] = value;
    setEditOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    setEditOptions(editOptions.filter((_, i) => i !== index));
  };

  const handleAddNewNode = () => {
    if (!newNodeId.trim()) {
        toast({ title: t('messenger_flow.editor_new_node_id_req_title'), description: t('messenger_flow.editor_new_node_id_req_desc'), variant: 'destructive'});
        return;
    }
    if (nodes.find(node => node.id === newNodeId.trim())) {
        toast({ title: t('messenger_flow.editor_new_node_id_exists_title'), description: t('messenger_flow.editor_new_node_id_exists_desc', '{nodeId} already exists.').replace('{nodeId}', newNodeId.trim()), variant: 'destructive'});
        return;
    }
    const newNode: Node = {
      id: newNodeId.trim(),
      type: 'default',
      data: { label: newNodeId.trim(), message: t('messenger_flow.editor_new_node_default_msg'), options: [] },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
    setNewNodeId('');
    toast({ title: t('messenger_flow.editor_new_node_added_title'), description: t('messenger_flow.editor_new_node_added_desc', '{nodeId} added. Select it to edit.').replace('{nodeId}', newNode.id)});
  };


  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <Card className="w-full md:w-[350px] md:h-full flex flex-col m-2 shrink-0">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Workflow className="h-4 w-4" /> {t('messenger_flow.editor_panel_title', 'Flow Editor')}: {flowId}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
            <div className="space-y-2">
                <Label htmlFor="newNodeId" className="text-xs">{t('messenger_flow.editor_add_step_label')}</Label>
                <div className="flex gap-2">
                    <Input id="newNodeId" placeholder={t('messenger_flow.editor_new_step_id_placeholder')} value={newNodeId} onChange={(e) => setNewNodeId(e.target.value)} className="text-xs h-8" />
                    <Button onClick={handleAddNewNode} size="sm" className="h-8"><Plus className="h-3 w-3 mr-1" /> {t('messenger_flow.editor_add_button')}</Button>
                </div>
            </div>

            {selectedNode && (
            <div className="space-y-3 pt-3 border-t">
                <h3 className="text-xs font-semibold">{t('messenger_flow.editor_edit_step_title', 'Edit Step:')} <span className="font-mono text-primary">{selectedNode.id}</span></h3>
                <div>
                <Label htmlFor="editMessage" className="text-xs">{t('messenger_flow.editor_message_label')}</Label>
                <Textarea id="editMessage" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} placeholder={t('messenger_flow.editor_message_placeholder')} rows={3} className="text-xs mt-1" />
                </div>
                <div>
                <Label className="text-xs">{t('messenger_flow.editor_options_label')}</Label>
                {editOptions.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center mt-1 p-2 border rounded-md">
                    <Input value={option.keyword} onChange={(e) => handleOptionChange(index, 'keyword', e.target.value)} placeholder={t('messenger_flow.editor_option_keyword_placeholder')} className="text-xs h-8 flex-1" />
                    <Input value={option.next} onChange={(e) => handleOptionChange(index, 'next', e.target.value)} placeholder={t('messenger_flow.editor_option_next_placeholder')} className="text-xs h-8 flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} className="h-7 w-7 text-destructive">
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    </div>
                ))}
                <Button onClick={handleAddOption} variant="outline" size="sm" className="mt-2 w-full h-8"><Plus className="h-3 w-3 mr-1" /> {t('messenger_flow.editor_add_option_button')}</Button>
                </div>
                <Button onClick={handleUpdateSelectedNodeDetails} size="sm" className="w-full h-8">{t('messenger_flow.editor_apply_node_changes_button')}</Button>
            </div>
            )}
            {!selectedNode && <p className="text-xs text-muted-foreground text-center py-4">{t('messenger_flow.editor_select_node_prompt')}</p>}
        </CardContent>
        <div className="p-4 border-t">
            <Button onClick={handleSaveFlow} disabled={isSaving} className="w-full h-9">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t('messenger_flow.editor_save_flow_button')}
            </Button>
        </div>
      </Card>
      <div className="flex-1 h-full w-full min-h-[300px] md:min-h-0">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            fitView
            className="bg-muted"
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
