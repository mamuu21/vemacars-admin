import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import BackArrow from '@/components/ui/backarrow';
import { CustomerTable } from './table';
import { CustomerForm } from './form';
import { DeleteDialog } from './delete';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Dormant';
  total_invoices_paid?: number;
}

export const CustomersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Dormant'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered and Paginated Data
  const getFilteredCustomers = () => {
    let filtered = customers;

    if (filter !== 'All') {
      filtered = filtered.filter(c => c.status === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredCustomers = getFilteredCustomers();
  const totalItems = filteredCustomers.length;

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    setIsDeleting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));

    toast({
      title: 'Success',
      description: 'Customer deleted successfully',
    });

    setIsDeleting(false);
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setShowCreateModal(false);
    toast({
      title: 'Success',
      description: 'Customer created successfully',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <BackArrow onClick={() => navigate(-1)} />
          <h2 className="text-xl font-semibold">
            Customers
          </h2>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Customer
        </Button>
      </div>

      <CustomerTable
        customers={paginatedCustomers}
        count={totalItems}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onDeleteClick={(customer) => {
          setSelectedCustomer(customer);
          setShowDeleteModal(true);
        }}
        onViewDetails={(customerId) => navigate(`/customers/${customerId}`)}
      />

      <CustomerForm
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onSubmit={handleCreateCustomer}
        nextId={customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1}
      />

      <DeleteDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteCustomer}
        itemName={selectedCustomer?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CustomersPage;