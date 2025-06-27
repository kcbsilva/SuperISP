// src/lib/validators/subscriber.ts
import * as z from 'zod';

/* ------------------------------------------------------------------
   Central schema for BOTH Add & Update Subscriber forms
------------------------------------------------------------------- */
export const subscriberSchema = z.object({
  subscriber_type: z.enum(['Residential', 'Commercial'], {
    required_error: 'You need to select a subscriber type.',
  }),

  /* Residential–specific */
  full_name: z.string().optional(),
  birthday: z.date().optional(),

  /* Commercial–specific */
  company_name: z.string().optional(),
  established_date: z.date().optional(),

  /* Shared */
  address: z.string().min(1, 'Address is required'),
  point_of_reference: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  mobile_number: z.string().optional(),
  tax_id: z.string().optional(),
  business_number: z.string().optional(),
  id_number: z.string().optional(),
  signup_date: z.date().optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Planned', 'Canceled'])
            .default('Active')
            .optional(),
})
/* ------------- Cross-field rules -------------------------------- */
.refine(d => d.subscriber_type !== 'Residential' || (d.full_name && d.full_name.length > 0), {
  message: 'Full Name is required for Residential subscribers.',
  path: ['full_name'],
})
.refine(d => d.subscriber_type !== 'Residential' || d.birthday, {
  message: 'Birthday is required for Residential subscribers.',
  path: ['birthday'],
})
.refine(d => d.subscriber_type !== 'Residential' || (d.tax_id && d.tax_id.length > 0), {
  message: 'Tax ID is required for Residential subscribers.',
  path: ['tax_id'],
})
.refine(d => d.subscriber_type !== 'Commercial' || (d.company_name && d.company_name.length > 0), {
  message: 'Company Name is required for Commercial subscribers.',
  path: ['company_name'],
})
.refine(d => d.subscriber_type !== 'Commercial' || d.established_date, {
  message: 'Established Date is required for Commercial subscribers.',
  path: ['established_date'],
})
.refine(d => d.subscriber_type !== 'Commercial' || (d.tax_id && d.tax_id.length > 0), {
  message: 'CNPJ (Tax ID) is required for Commercial subscribers.',
  path: ['tax_id'],
});

/* Convenience type */
export type SubscriberFormData = z.infer<typeof subscriberSchema>;
