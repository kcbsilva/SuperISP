// /src/components/flow/nodes/MessageNode.tsx
import {
    MessageCircle,
    AlertTriangle,
    Clock,
    Zap,
    Globe,
    Mail,
  } from 'lucide-react';
  import { NodeProps } from 'reactflow';
  import React from 'react';
  import { NodeWrapper } from './NodeWrapper';
  
  export function MessageNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="green" icon={<MessageCircle />} title="Message" />;
  }
  
  export function ConditionNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="blue" icon={<AlertTriangle />} title="Condition" />;
  }
  
  export function DelayNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="yellow" icon={<Clock />} title="Delay" />;
  }
  
  export function ActionNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="purple" icon={<Zap />} title="Action" />;
  }
  
  export function WebhookNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="teal" icon={<Globe />} title="Webhook" />;
  }
  
  export function EmailNode(props: NodeProps) {
    return <NodeWrapper id={props.id} data={props.data} selected={props.selected} color="rose" icon={<Mail />} title="Email" />;
  }
  