'use server';
/**
 * @fileOverview Generates provisioning scripts for Fiberhome 5506-01-A1 ONTs.
 *
 * - provisionFiberhomeOnt - A function that generates the provisioning script.
 * - ProvisionFiberhomeOntInput - The input type for the provisionFiberhomeOnt function.
 * - ProvisionFiberhomeOntOutput - The return type for the provisionFiberhomeOnt function.
 */

import {ai} from '@/ai/ai-instance'; // Using the main AI instance
import {z} from 'genkit';

const ProvisionFiberhomeOntInputSchema = z.object({
  onuSerial: z.string().describe("The physical address (serial number) of the ONU. E.g., ABCD12345678"),
  slotNumber: z.number().int().positive().describe("The OLT slot number where the ONU is connected."),
  portNumber: z.number().int().positive().describe("The OLT PON port number where the ONU is connected."),
  onuNumber: z.number().int().positive().describe("The ONU ID on the PON port."),
  portVlan: z.number().int().min(1).max(4094).describe("The VLAN ID to be configured on the ONU port."),
});
export type ProvisionFiberhomeOntInput = z.infer<typeof ProvisionFiberhomeOntInputSchema>;

const ProvisionFiberhomeOntOutputSchema = z.object({
  script: z.string().describe("The generated provisioning script for the Fiberhome ONT."),
});
export type ProvisionFiberhomeOntOutput = z.infer<typeof ProvisionFiberhomeOntOutputSchema>;

export async function provisionFiberhomeOnt(input: ProvisionFiberhomeOntInput): Promise<ProvisionFiberhomeOntOutput> {
  return provisionFiberhomeOntFlow(input);
}

const provisioningPrompt = ai.definePrompt({
  name: 'provisionFiberhomeOntPrompt',
  input: {schema: ProvisionFiberhomeOntInputSchema},
  output: {schema: ProvisionFiberhomeOntOutputSchema},
  prompt: `Generate a provisioning script for a Fiberhome 5506-01-A1 ONT using the following details:
ONU Serial: {{{onuSerial}}}
OLT Slot Number: {{{slotNumber}}}
OLT PON Port Number: {{{portNumber}}}
ONU Number on PON Port: {{{onuNumber}}}
Port VLAN: {{{portVlan}}}

The script should follow this template exactly, replacing the placeholders with the provided values:
# Atenção: Para Fiberhome, procure utilizar o comando save, do contrário, as configurações podem ser perdidas.

# Autoriza ONU
cd onu
set whitelist phy_addr address {{{onuSerial}}} password null action add slot {{{slotNumber}}} pon {{{portNumber}}} onu {{{onuNumber}}} type 5506-01-A1

# Configura VLAN da ONU
cd lan
set epon slot {{{slotNumber}}} pon {{{portNumber}}} onu {{{onuNumber}}} port 1 service num 1
set epon slot {{{slotNumber}}} pon {{{portNumber}}} onu {{{onuNumber}}} port 1 service 1 vlan_mode tag 0 33024 {{{portVlan}}}
apply onu {{{slotNumber}}} {{{portNumber}}} {{{onuNumber}}} vlan

# Persiste alteração
cd ..
cd ..
save
`,
});

const provisionFiberhomeOntFlow = ai.defineFlow(
  {
    name: 'provisionFiberhomeOntFlow',
    inputSchema: ProvisionFiberhomeOntInputSchema,
    outputSchema: ProvisionFiberhomeOntOutputSchema,
  },
  async (input: ProvisionFiberhomeOntInput) => {
    const {output} = await provisioningPrompt(input);
    if (!output || !output.script) {
      throw new Error('Failed to generate provisioning script. The AI model did not return the expected output.');
    }
    return output;
  }
);
