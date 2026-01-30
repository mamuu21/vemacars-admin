import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import BackArrow from '@/components/ui/backarrow';

// import InvoiceTablePage from '../invoices/invoicetablepage';

interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

const MOCK_CUSTOMER: Customer = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 555-0123",
  address: "123 Main St, New York, NY",
  status: "Active",
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Simulate fetching customer data
    // In a real app with local state, we'd need a context or store
    // For now, we return the mock customer regardless of ID for demonstration
    setCustomer({
      ...MOCK_CUSTOMER,
      id: id ? parseInt(id) : 1
    });
  }, [id]);

  if (!customer) {
    return (
      <div className="container py-4">
        <p className="text-center text-destructive">Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BackArrow onClick={() => navigate(-1)} />
          <h2 className="text-xl font-semibold">Customer Details</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Customer Summary Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer Summary
              </CardTitle>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-3">
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="font-medium">{customer.name}</span>
                    </TableCell>

                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3">
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-medium">{customer.email}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3">
                      <span className="text-muted-foreground">Phone:</span>{' '}
                      <span className="font-medium">{customer.phone}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="py-4">
                      <span className="text-muted-foreground">Address:</span>{' '}
                      <span className="font-medium">{customer.address}</span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-3">
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <span className="font-medium">{customer.status}</span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Status Updates Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex justify-between mb-2 px-4">
                <span className="text-muted-foreground font-semibold">Status</span>
                <span className="text-muted-foreground font-semibold">Date</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" className="w-full">
                Add Step
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="invoices">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="gps">Live GPS</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <div className="p-4 text-center text-muted-foreground">
            Invoices content temporarily disabled during refactor
          </div>
          {/* {customer.id && <InvoiceTablePage customerId={customer.id.toString()} />} */}
        </TabsContent>

        <TabsContent value="gps" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground py-8">Live GPS tracking would be rendered here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetails;
