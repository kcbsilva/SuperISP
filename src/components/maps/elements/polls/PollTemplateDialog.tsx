// src/components/maps/elements/polls/PollTemplateDialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PollTemplate } from './types';

interface PollTemplateDialogProps {
  templates: PollTemplate[];
  onAdd: (template: PollTemplate) => void;
  onEdit?: (template: PollTemplate) => void;
  onDelete?: (templateId: string) => void;
  manufacturers: string[];
  materials: string[];
}

export default function PollTemplateDialog({
  templates,
  onAdd,
  onEdit,
  onDelete,
  manufacturers,
  materials
}: PollTemplateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<Omit<PollTemplate, 'id'>>({
    manufacturer: '',
    material: '',
    height: '',
    type: 'Circular'
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const finalTemplate: PollTemplate = {
      ...form,
      id: editId ?? `tpl-${Date.now()}`
    };

    if (isEditing && onEdit) {
      onEdit(finalTemplate);
      toast({ title: 'Template updated', description: `${form.type} ${form.height}` });
    } else {
      onAdd(finalTemplate);
      toast({ title: 'Template added', description: `${form.type} ${form.height}` });
    }

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ manufacturer: '', material: '', height: '', type: 'Circular' });
  };

  const handleEditClick = (template: PollTemplate) => {
    setForm({
      manufacturer: template.manufacturer || '',
      material: template.material,
      height: template.height,
      type: template.type
    });
    setEditId(template.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      onDelete?.(id);
      toast({ title: 'Template deleted' });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">
              <PlusCircle className="h-4 w-4 mr-2" />
              {isEditing ? 'Edit Template' : 'Add Template'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm">
                {isEditing ? 'Edit Poll Template' : 'New Poll Template'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1">
                <Label className="text-xs">Manufacturer</Label>
                <Select value={form.manufacturer} onValueChange={val => handleChange('manufacturer', val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label className="text-xs">Material</Label>
                <Select value={form.material} onValueChange={val => handleChange('material', val)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <Label className="text-xs">Height</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder="e.g., 12m"
                  value={form.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={val => handleChange('type', val as PollTemplate['type'])}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Circular">Circular</SelectItem>
                    <SelectItem value="Square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button size="sm" onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <span className="text-xs text-muted-foreground">
          Total: {templates.length}
        </span>
      </div>

      <div className="grid gap-2">
        {templates.length > 0 ? (
          templates.map(template => (
            <div key={template.id} className="flex items-center justify-between border rounded px-3 py-2 text-xs">
              <div className="flex flex-col">
                <span className="font-medium">{template.type} • {template.height}</span>
                <span className="text-muted-foreground">{template.material} • {template.manufacturer}</span>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditClick(template)}>
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteClick(template.id)}>
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic">No templates added.</p>
        )}
      </div>
    </div>
  );
}
