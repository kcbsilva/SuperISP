// src/app/settings/business/pops/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function PoPsPage() {
  // Placeholder data - replace with actual data fetching later
  const pops = [
    { id: 1, name: "Main Office POP", location: "123 Main St", status: "Active" },
    { id: 2, name: "Downtown POP", location: "456 Center Ave", status: "Active" },
    { id: 3, name: "Northside POP", location: "789 North Blvd", status: "Inactive" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Points of Presence (PoPs)</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add PoP
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing PoPs</CardTitle>
          <CardDescription>Manage your network's points of presence.</CardDescription>
        </CardHeader>
        <CardContent>
          {pops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {pops.map((pop) => (
                    <tr key={pop.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {pop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {pop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pop.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pop.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Placeholder for action buttons like Edit, Delete */}
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No PoPs found. Click "Add PoP" to create one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
