import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { Vehicle } from './table';
import { useToast } from '@/hooks/use-toast';

type VehicleFormProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void;
    initialData?: Vehicle | null;
};

// Simplified Inventory Form - NO Images, NO Content
export const VehicleForm = ({ open, onOpenChange, onSubmit, initialData }: VehicleFormProps) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
        name: '',
        car_type: 'SUV',
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        location: '',
        price_per_day: 0,
        status: 'Available',
        amenities: '', // Kept in type but hidden in form (or we should preserve if editing)
        overview: '', // Kept in type but hidden in form
        images: [] // Kept in type but hidden
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                car_type: initialData.car_type,
                fuel_type: initialData.fuel_type,
                transmission: initialData.transmission,
                seats: initialData.seats,
                location: initialData.location,
                price_per_day: initialData.price_per_day,
                status: initialData.status,
                amenities: initialData.amenities || '',
                overview: initialData.overview || '',
                images: initialData.images || []
            });
        } else {
            setFormData({
                name: '',
                car_type: 'SUV',
                fuel_type: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                location: '',
                price_per_day: 0,
                status: 'Available',
                amenities: '',
                overview: '',
                images: []
            });
        }
    }, [initialData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price_per_day) {
            toast({
                title: "Error",
                description: "Name and Price are required",
                variant: "destructive"
            });
            return;
        }

        if (initialData) {
            onSubmit({ ...formData, id: initialData.id });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[600px] max-w-full">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Vehicle Inventory' : 'Add New Vehicle'}</DialogTitle>
                    <DialogDescription>
                        Manage fleet inventory details. Content and Images are managed in the Website Editor.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Basic Info */}
                    <div>
                        <Label className="block text-sm font-medium mb-1">Vehicle Name (Model)</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Toyota Vitz"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium mb-1">Type</Label>
                            <Select
                                value={formData.car_type}
                                onValueChange={(val) => setFormData({ ...formData, car_type: val as any })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUV">SUV</SelectItem>
                                    <SelectItem value="Sedan">Sedan</SelectItem>
                                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-1">Price / Day ($)</Label>
                            <Input
                                type="number"
                                value={formData.price_per_day}
                                onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Location</Label>
                        <Input
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Dar es Salaam"
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Booked">Booked</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="block text-sm font-medium mb-1">Transmission</Label>
                            <Select
                                value={formData.transmission}
                                onValueChange={(val) => setFormData({ ...formData, transmission: val as any })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Automatic">Automatic</SelectItem>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="block text-sm font-medium mb-1">Fuel Type</Label>
                            <Select
                                value={formData.fuel_type}
                                onValueChange={(val) => setFormData({ ...formData, fuel_type: val as any })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Petrol">Petrol</SelectItem>
                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                    <SelectItem value="Electric">Electric</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label className="block text-sm font-medium mb-1">Seats</Label>
                        <Input
                            type="number"
                            value={formData.seats}
                            onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                            min={1}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {initialData ? 'Update Inventory' : 'Add Vehicle'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
