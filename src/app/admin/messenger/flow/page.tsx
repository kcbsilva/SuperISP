// src/app/admin/messenger/flow/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Workflow, PlusCircle, Trash2 } from 'lucide-react'; // Added Trash2
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/contexts/LocaleContext';
import { useToast } from '@/hooks/use-toast';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowOption {
  keyword: string;
  next: string;
}

interface FlowStep {
  message: string;
  options: FlowOption[];
}

interface FlowData {
  [key: string]: FlowStep;
}

export default function MessengerFlowPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const iconSize = "h-3 w-3";

  const [flow, setFlow] = React.useState<FlowData>({});
  const [selectedKey, setSelectedKey] = React.useState<string>('');
  const [localChanges, setLocalChanges] = React.useState<FlowData>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadFlow = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat/flow');
      if (!res.ok) throw new Error('Failed to fetch flow data');
      const json: FlowData = await res.json();
      setFlow(json);
      setLocalChanges(JSON.parse(JSON.stringify(json))); // Deep copy for local edits
      setSelectedKey(Object.keys(json)[0] || '');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error loading flow:", error);
      toast({ title: "Error", description: "Could not load flow configuration.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadFlow();
  }, [loadFlow]);

  const saveFlow = async (updatedFlow: FlowData) => {
    try {
      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlow),
      });
      if (!res.ok) throw new Error('Failed to save flow data');
      setFlow(updatedFlow);
      setLocalChanges(JSON.parse(JSON.stringify(updatedFlow))); // Update local copy
      setHasUnsavedChanges(false);
      toast({
        title: t('messenger_flow.save_success_title'),
        description: t('messenger_flow.save_success_desc'),
      });
    } catch (error) {
      console.error("Error saving flow:", error);
      toast({ title: "Error", description: "Could not save flow configuration.", variant: "destructive" });
    }
  };

  const applyChanges = () => {
    saveFlow(localChanges);
  };

  const updateOption = (index: number, field: 'keyword' | 'next', value: string) => {
    if (!selectedKey || !localChanges || !localChanges[selectedKey]) return;
    
    const updatedFlow = { ...localChanges };
    const stepToUpdate = { ...updatedFlow[selectedKey] };
    if (!stepToUpdate.options) {
      stepToUpdate.options = [];
    }
    if (!stepToUpdate.options[index]) {
      stepToUpdate.options[index] = { keyword: '', next: '' };
    }
    stepToUpdate.options[index][field] = value;
    updatedFlow[selectedKey] = stepToUpdate;
    setLocalChanges(updatedFlow);
    setHasUnsavedChanges(true);
  };

  const deleteOption = (index: number) => {
    if (!selectedKey || !localChanges || !localChanges[selectedKey] || !localChanges[selectedKey].options) return;
    
    const updatedFlow = { ...localChanges };
    const stepToUpdate = { ...updatedFlow[selectedKey] };
    stepToUpdate.options.splice(index, 1);
    updatedFlow[selectedKey] = stepToUpdate;
    setLocalChanges(updatedFlow);
    setHasUnsavedChanges(true);
  };

  const addOption = () => {
    if (!selectedKey || !localChanges || !localChanges[selectedKey]) return;
    
    const updatedFlow = { ...localChanges };
    const stepToUpdate = { ...updatedFlow[selectedKey] };
    if (!stepToUpdate.options) {
      stepToUpdate.options = [];
    }
    stepToUpdate.options.push({ keyword: '', next: '' });
    updatedFlow[selectedKey] = stepToUpdate;
    setLocalChanges(updatedFlow);
    setHasUnsavedChanges(true);
  };

  const updateMessage = (msg: string) => {
    if (!selectedKey || !localChanges || !localChanges[selectedKey]) return;
    
    const updatedFlow = { ...localChanges };
    updatedFlow[selectedKey] = { ...updatedFlow[selectedKey], message: msg };
    setLocalChanges(updatedFlow);
    setHasUnsavedChanges(true);
  };

  const addFlowStep = () => {
    const newKey = prompt(t('messenger_flow.prompt_new_step_key'));
    if (!newKey || (localChanges && localChanges[newKey])) {
        toast({ title: t('messenger_flow.error_step_key_title'), description: newKey && localChanges[newKey] ? t('messenger_flow.error_step_key_exists_desc') : t('messenger_flow.error_step_key_invalid_desc'), variant: "destructive"});
        return;
    }
    const updatedFlow = {
      ...localChanges,
      [newKey]: { message: t('messenger_flow.new_step_default_message'), options: [] }
    };
    setLocalChanges(updatedFlow);
    setSelectedKey(newKey);
    setHasUnsavedChanges(true);
  };

  const deleteStep = () => {
    if (!selectedKey || !localChanges || !localChanges[selectedKey] || Object.keys(localChanges).length <= 1) {
        toast({ title: t('messenger_flow.error_delete_step_title'), description: t('messenger_flow.error_delete_step_desc'), variant: "destructive"});
        return;
    }
    
    const updatedFlow = { ...localChanges };
    delete updatedFlow[selectedKey];
    const nextKey = Object.keys(updatedFlow)[0] || '';
    setLocalChanges(updatedFlow);
    setSelectedKey(nextKey);
    setHasUnsavedChanges(true);
  };

  const buildGraph = React.useCallback((): { nodes: Node[]; edges: Edge[] } => {
    if (!localChanges || Object.keys(localChanges).length === 0) return { nodes: [], edges: [] };
    
    const nodes: Node[] = Object.entries(localChanges).map(([key, step], i) => ({
      id: key,
      data: { label: `${key}: ${step.message.substring(0, 30)}${step.message.length > 30 ? '...' : ''}` },
      position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 150 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: { 
        width: 200, 
        fontSize: '10px',
        padding: '8px',
        backgroundColor: key === selectedKey ? 'hsl(var(--primary))' : 'hsl(var(--card))',
        color: key === selectedKey ? 'hsl(var(--primary-foreground))' : 'hsl(var(--card-foreground))',
        border: key === selectedKey ? '2px solid hsl(var(--ring))' : '1px solid hsl(var(--border))'
      },
    }));

    const edges: Edge[] = [];
    for (const [sourceKey, step] of Object.entries(localChanges)) {
      step.options?.forEach((opt, index) => {
        if (localChanges[opt.next]) {
          edges.push({ 
            id: `${sourceKey}-${opt.next}-${index}`, 
            source: sourceKey, 
            target: opt.next, 
            label: opt.keyword || `Opt ${index + 1}`,
            type: 'smoothstep',
            animated: true,
            labelStyle: { fontSize: '8px' },
            style: { strokeWidth: 1.5 }
          });
        }
      });
    }
    return { nodes, edges };
  }, [localChanges, selectedKey]);

  const { nodes, edges } = buildGraph();
  const currentStep = selectedKey && localChanges && localChanges[selectedKey] ? localChanges[selectedKey] : null;

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 h-full">
      <div className="flex justify-between items-center shrink-0">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          {t('sidebar.messenger_flow', 'Messenger Flows')}
          {hasUnsavedChanges && <span className="text-orange-500 text-xs">({t('messenger_flow.unsaved_changes_indicator')})</span>}
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={applyChanges} 
            disabled={!hasUnsavedChanges || isLoading}
            variant={hasUnsavedChanges ? "default" : "secondary"}
            size="sm"
          >
            {t('messenger_flow.apply_changes_button')}
          </Button>
          <Button onClick={addFlowStep} size="sm" disabled={isLoading}>
            <PlusCircle className={`mr-2 ${iconSize}`} />
            {t('messenger_flow.add_step_button')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('messenger_flow.edit_step_title')}</CardTitle>
            <CardDescription className="text-xs">{t('messenger_flow.edit_step_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto space-y-4">
            {isLoading ? (
              <p>{t('messenger_flow.loading_flow')}</p>
            ) : !localChanges || Object.keys(localChanges).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                <p>{t('messenger_flow.no_steps_placeholder')}</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 items-center">
                  <label htmlFor="flow-step-select" className="text-xs shrink-0">{t('messenger_flow.select_step_label')}:</label>
                  <select
                    id="flow-step-select"
                    className="border rounded p-1 text-xs flex-grow bg-input text-foreground border-border focus:ring-ring focus:border-ring"
                    value={selectedKey}
                    onChange={e => setSelectedKey(e.target.value)}
                  >
                    {Object.keys(localChanges).map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={deleteStep}
                    disabled={!currentStep || Object.keys(localChanges).length <= 1}
                    title={t('messenger_flow.delete_step_button_tooltip')}
                  >
                    <Trash2 className={iconSize} />
                  </Button>
                </div>

                {currentStep && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="step-message" className="text-xs block mb-1">{t('messenger_flow.message_label')}:</label>
                      <Textarea
                        id="step-message"
                        rows={5}
                        value={currentStep.message || ''}
                        onChange={(e) => updateMessage(e.target.value)}
                        className="mt-1 text-xs"
                        placeholder={t('messenger_flow.message_placeholder')}
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1">{t('messenger_flow.options_label')}:</label>
                      {currentStep.options?.map((opt, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-1.5 p-1.5 border border-border rounded-md bg-card">
                          <Input
                            placeholder={t('messenger_flow.keyword_placeholder')}
                            value={opt.keyword || ''}
                            onChange={(e) => updateOption(idx, 'keyword', e.target.value)}
                            className="w-1/3 text-xs h-7"
                          />
                          <Input
                            placeholder={t('messenger_flow.next_step_placeholder')}
                            value={opt.next || ''}
                            onChange={(e) => updateOption(idx, 'next', e.target.value)}
                            className="w-1/2 text-xs h-7"
                          />
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteOption(idx)} title={t('messenger_flow.delete_option_button_tooltip')}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addOption} className="mt-1 text-xs">
                         <PlusCircle className={`mr-1.5 ${iconSize}`} /> {t('messenger_flow.add_option_button')}
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col min-h-[300px] md:min-h-0">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm">{t('messenger_flow.visualization_title')}</CardTitle>
            <CardDescription className="text-xs">{t('messenger_flow.visualization_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow relative">
            {isLoading ? (
                <p className="text-xs text-muted-foreground text-center">{t('messenger_flow.loading_visualization')}</p>
            ) : (
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                onNodeClick={(_, node) => setSelectedKey(node.id)}
                className="bg-muted/30 rounded-md"
            >
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
                <Controls showInteractive={false}/>
                <Background color="hsl(var(--border))" gap={16} />
            </ReactFlow>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
