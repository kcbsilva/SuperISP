// src/components/maps/elements/polls/PollTemplateDialog.tsx
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import {
  Form, FormField, FormLabel, FormItem, FormControl, FormMessage
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePlus2, List, FileText, Pencil } from 'lucide-react';

const pollTypes = ['Circular', 'Square'] as const;
const pollTemplateSchema = z.object({
  manufacturer: z.string().optional(),
  material: z.string().min(1, 'Material is required'),
  height: z.string().min(1, 'Height is required'),
  type: z.enum(pollTypes, { required_error: 'Poll type is required' }),
});

type PollTemplateFormData = z.infer<typeof pollTemplateSchema>;
interface PollTemplate extends PollTemplateFormData { id: string; }

interface Props {
  templates: PollTemplate[];
  onAdd: (template: PollTemplate) => void;
  manufacturers: string[];
  materials: string[];
}

export default function PollTemplateDialog({ templates, onAdd, manufacturers, materials }: Props) {
  const [open, setOpen] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<string | null>(null);

  const form = useForm<PollTemplateFormData>({
    resolver: zodResolver(pollTemplateSchema),
    defaultValues: { manufacturer: '', material: '', height: '', type: undefined },
  });

  const handleSubmit = (data: PollTemplateFormData) => {
    if (editingTemplateId) {
      const updated = templates.map(t => t.id === editingTemplateId ? { ...t, ...data } : t);
      onAdd(updated.find(t => t.id === editingTemplateId)!); // replace
    } else {
      const exists = templates.some(
        t => t.height === data.height && t.material === data.material && t.type === data.type
      );
      if (exists) return alert('Template already exists');
      const newTpl: PollTemplate = { ...data, id: `tpl-${Date.now()}` };
      onAdd(newTpl);
    }
    form.reset();
    setEditingTemplateId(null);
    setOpen(false);
  };

  const handleEditClick = (template: PollTemplate) => {
    form.reset({ ...template });
    setEditingTemplateId(template.id);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditingTemplateId(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-3 h-3 mr-2" /> Poll Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-sm">{editingTemplateId ? 'Edit Template' : 'Manage Poll Templates'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <fieldset className="md:col-span-2 border border-border rounded-md p-4 pt-2 space-y-4">
            <legend className="text-sm font-semibold px-2 flex items-center gap-2">
              <FilePlus2 className="w-3 h-3 text-primary" /> {editingTemplateId ? 'Edit Template' : 'New Template'}
            </legend>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select Manufacturer" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {manufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select Material" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {materials.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 12m Concrete" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pollTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
                  <Button type="submit">{editingTemplateId ? 'Update' : 'Save'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </fieldset>
          <fieldset className="md:col-span-1 border border-border rounded-md p-4 pt-2 space-y-2">
            <legend className="text-sm font-semibold px-2 flex items-center gap-2">
              <List className="w-3 h-3 text-primary" /> Existing Templates
            </legend>
            <ScrollArea className="h-[260px] bg-muted/50 rounded-md p-2">
              {templates.length > 0 ? (
                templates.map(template => (
                  <div key={template.id} className="text-xs p-1.5 border-b last:border-b-0 hover:bg-background rounded-sm cursor-default flex justify-between items-center">
                    <div>
                      <div className="font-medium">{template.manufacturer ? `${template.manufacturer} - ` : ''}{template.material} - {template.type}</div>
                      <div className="text-muted-foreground">Height: {template.height}</div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditClick(template)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No templates</p>
              )}
            </ScrollArea>
          </fieldset>
        </div>
      </DialogContent>
    </Dialog>
  );
}
