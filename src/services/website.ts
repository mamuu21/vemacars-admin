import api from '@/utils/api';
import type { BlogPost } from '@/pages/website-editor/blog';

export const WebsiteService = {
    // Hero Section
    getHero: async () => {
        const response = await api.get('/website/hero/');
        return response.data;
    },

    updateHero: async (data: any, imageFile?: File) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('ticks', data.ticks);
        formData.append('cta_text', data.cta_text);

        if (imageFile) {
            formData.append('background_image', imageFile);
        }

        // Determine if we are creating or updating (usually just updating the singleton)
        // Assuming the backend handles the singleton logic on POST or a specific ID
        // For singleton patterns, often we just POST to root or PUT to an ID if we know it.
        // Let's assume POST to /website/hero/ handles "update if exists" as per our design.

        const response = await api.post('/website/hero/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Blog Posts
    getBlogs: async (params?: any) => {
        const response = await api.get<BlogPost[]>('/website/blogs/', { params });
        return response.data;
    },

    getBlog: async (id: number | string) => {
        const response = await api.get<BlogPost>(`/website/blogs/${id}/`);
        return response.data;
    },

    createBlog: async (data: any, imageFile?: File) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('is_featured', String(data.is_featured));

        if (imageFile) {
            formData.append('image', imageFile); // Changed from featured_image to match common patterns, check backend design
            // Backend design said 'image', checking... Yes backend design says 'image' in BlogPost model.
        }

        const response = await api.post<BlogPost>('/website/blogs/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateBlog: async (id: number | string, data: any, imageFile?: File) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('is_featured', String(data.is_featured));

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const response = await api.put<BlogPost>(`/website/blogs/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteBlog: async (id: number | string) => {
        await api.delete(`/website/blogs/${id}/`);
    }
};
