// src/app/subscribers/profile/[id]/page.tsx
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Server as ServerIcon, DollarSign, Wrench, Package } from 'lucide-react'; // Rename Server to avoid conflict
import { useParams } from 'next/navigation'; // Import useParams to get the ID

// Placeholder data - replace with actual data fetching based on ID
const getSubscriberData = (id: string | string[]) => {
    // Simulate fetching data for the given ID
    console.log("Fetching data for subscriber ID:", id);
    return {
      id: id,
      name: id === 'sub-1' ? 'Alice Wonderland' : id === 'sub-2' ? 'Bob The Builder Inc.' : `Subscriber ${id}`,
      type: id === 'sub-2' ? 'Commercial' : 'Residential',
      status: 'Active',
      address: '123 Fantasy Lane',
      email: 'subscriber@example.com',
      phone: '555-1234',
      // Add more details as needed
    };
};

export default function SubscriberProfilePage() {
  const params = useParams();
  const subscriberId = params.id; // Get the ID from the route parameters

  // Simulate fetching subscriber data
  const subscriber = React.useMemo(() => getSubscriberData(subscriberId), [subscriberId]);

  if (!subscriber) {
    return <div>Loading subscriber data...</div>; // Or a proper loading state
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {subscriber.type === 'Residential' ? (
              <User className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Building className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <CardTitle>{subscriber.name}</CardTitle>
              <CardDescription>
                {subscriber.type} Subscriber - ID: {subscriber.id} - Status: <span className="font-medium text-green-600">{subscriber.status}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {/* Optional: Add more basic info here if needed outside tabs */}
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">
            <User className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="services">
             <ServerIcon className="mr-2 h-4 w-4" /> Services
          </TabsTrigger>
          <TabsTrigger value="billing">
             <DollarSign className="mr-2 h-4 w-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="service-calls">
             <Wrench className="mr-2 h-4 w-4" /> Service Calls
          </TabsTrigger>
          <TabsTrigger value="inventory">
             <Package className="mr-2 h-4 w-4" /> Inventory
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>General information about the subscriber.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Name:</strong> {subscriber.name}</p>
              <p><strong>Type:</strong> {subscriber.type}</p>
              <p><strong>Status:</strong> {subscriber.status}</p>
              <p><strong>Address:</strong> {subscriber.address}</p>
              <p><strong>Email:</strong> {subscriber.email}</p>
              <p><strong>Phone:</strong> {subscriber.phone}</p>
              {/* Add more details */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab Content */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Services currently subscribed to by the customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Services details will be displayed here. (Not Implemented)</p>
              {/* Placeholder for services list/details */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab Content */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Invoices, payments, and billing history.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Billing information will be displayed here. (Not Implemented)</p>
              {/* Placeholder for invoices table, payment methods, etc. */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Calls Tab Content */}
        <TabsContent value="service-calls">
          <Card>
            <CardHeader>
              <CardTitle>Service Calls</CardTitle>
              <CardDescription>History of support tickets and service visits.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Service call history will be displayed here. (Not Implemented)</p>
              {/* Placeholder for service calls list/table */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab Content */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Equipment assigned to the subscriber.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Assigned inventory will be displayed here. (Not Implemented)</p>
              {/* Placeholder for assigned equipment list */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
