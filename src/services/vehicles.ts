import api from '@/utils/api';
import type { Vehicle } from '@/pages/vehicles/table';

export const VehiclesService = {
    getAll: async (params?: any) => {
        const response = await api.get<Vehicle[]>('/vehicles/', { params });
        return response.data;
    },

    getById: async (id: number | string) => {
        const response = await api.get<Vehicle>(`/vehicles/${id}/`);
        return response.data;
    },

    create: async (data: Omit<Vehicle, 'id'>) => {
        const formData = new FormData();

        // Append simple fields
        Object.keys(data).forEach(key => {
            if (key !== 'images') {
                const value = data[key as keyof typeof data];
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            }
        });

        // Handle images (assuming data.images contains objects with 'file' property if new)
        // Note: The frontend form logic might need adjustment to pass raw Files
        // For now, we assume the component handles calling this with proper FormData
        // But actually, let's make this robust.

        // Simplification: We expect the caller to might pass FormData directly OR we construct it here.
        // If we passed the raw object, we need to handle file uploads separately or use Multipart.

        return api.post<Vehicle>('/vehicles/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Robust Create Method that expects FormData or builds it
    createWithImages: async (vehicleData: any, files: File[]) => {
        const formData = new FormData();

        // Append vehicle data
        Object.keys(vehicleData).forEach(key => {
            if (key !== 'images' && vehicleData[key] !== undefined) {
                formData.append(key, vehicleData[key]);
            }
        });

        // Append files
        files.forEach((file) => {
            formData.append('uploaded_images', file);
        });

        const response = await api.post<Vehicle>('/vehicles/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    update: async (id: number | string, data: Partial<Vehicle>) => {
        const response = await api.put<Vehicle>(`/vehicles/${id}/`, data);
        return response.data;
    },

    updateWithImages: async (id: number | string, vehicleData: any, newFiles: File[]) => {
        const formData = new FormData();

        Object.keys(vehicleData).forEach(key => {
            if (key !== 'images' && vehicleData[key] !== undefined) {
                formData.append(key, vehicleData[key]);
            }
        });

        newFiles.forEach((file) => {
            formData.append('uploaded_images', file);
        });

        const response = await api.put<Vehicle>(`/vehicles/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    delete: async (id: number | string) => {
        await api.delete(`/vehicles/${id}/`);
    }
};
