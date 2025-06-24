// /src/components/flow/FlowToolbox.tsx
'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, AlertTriangle, Clock, Zap, Globe, Mail } from 'lucide-react';
import * as React from 'react';

export const FlowToolbox = () => {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'message', label: 'Message', icon: <MessageCircle className="h-4 w-4 mr-1" /> },
    { type: 'condition', label: 'Condition', icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
    { type: 'delay', label: 'Delay', icon: <Clock className="h-4 w-4 mr-1" /> },
    { type: 'action', label: 'Action', icon: <Zap className="h-4 w-4 mr-1" /> },
    { type: 'webhook', label: 'Webhook', icon: <Globe className="h-4 w-4 mr-1" /> },
    { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4 mr-1" /> },
  ];

  return (
    <aside className="w-48 p-3 border-r bg-white space-y-2 text-xs">
      <p className="font-semibold">Toolbox</p>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="p-2 border rounded-md shadow-sm cursor-grab hover:bg-muted flex items-center"
          onDragStart={(e) => handleDragStart(e, node.type)}
          draggable
        >
          {node.icon} {node.label}
        </div>
      ))}
    </aside>
  );
};
