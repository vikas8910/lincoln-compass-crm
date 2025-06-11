import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import MainLayout from '@/components/layout/MainLayout';

// Types matching your Java entities
interface BaseEntity {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Country extends BaseEntity {
  code: string;
  cities?: City[];
}

interface City extends BaseEntity {
  countryId?: number;
}

interface Course extends BaseEntity {}

interface LeadType extends BaseEntity {}

interface Source extends BaseEntity {}

interface University extends BaseEntity {}

type EntityType = 'universities' | 'countries' | 'cities' | 'courses' | 'sources' | 'leadTypes';

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface PaginationState {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

const MasterDataManagement = () => {
  const [activeTab, setActiveTab] = useState<EntityType>('universities');
  const [data, setData] = useState<Record<EntityType, BaseEntity[]>>({
    universities: [],
    countries: [],
    cities: [],
    courses: [],
    sources: [],
    leadTypes: []
  });
  const [pagination, setPagination] = useState<Record<EntityType, PaginationState>>({
    universities: { page: 0, size: 20, total: 0, totalPages: 0 },
    countries: { page: 0, size: 20, total: 0, totalPages: 0 },
    cities: { page: 0, size: 20, total: 0, totalPages: 0 },
    courses: { page: 0, size: 20, total: 0, totalPages: 0 },
    sources: { page: 0, size: 20, total: 0, totalPages: 0 },
    leadTypes: { page: 0, size: 20, total: 0, totalPages: 0 }
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<BaseEntity | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Configuration for each entity type matching your Java entities
  const entityConfig = {
    universities: {
      title: 'Universities',
      endpoint: 'universities',
      icon: '🎓',
      color: 'blue',
      fields: [
        { key: 'name', label: 'University Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    },
    countries: {
      title: 'Countries',
      endpoint: 'countries',
      icon: '🌍',
      color: 'green',
      fields: [
        { key: 'name', label: 'Country Name', type: 'text', required: true },
        { key: 'code', label: 'Country Code', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    },
    cities: {
      title: 'Cities',
      endpoint: 'cities',
      icon: '🏙️',
      color: 'purple',
      fields: [
        { key: 'name', label: 'City Name', type: 'text', required: true },
        { key: 'countryId', label: 'Country', type: 'select', required: true, options: 'countries' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    },
    courses: {
      title: 'Courses',
      endpoint: 'courses',
      icon: '📚',
      color: 'orange',
      fields: [
        { key: 'name', label: 'Course Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    },
    sources: {
      title: 'Sources',
      endpoint: 'sources',
      icon: '📡',
      color: 'pink',
      fields: [
        { key: 'name', label: 'Source Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    },
    leadTypes: {
      title: 'Lead Types',
      endpoint: 'lead-types',
      icon: '🎯',
      color: 'indigo',
      fields: [
        { key: 'name', label: 'Lead Type Name', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'isActive', label: 'Active Status', type: 'boolean' }
      ]
    }
  };

  // API functions for your REST endpoints
  const apiCall = async (method: string, endpoint: string, data?: any, id?: number, page?: number, size?: number) => {
    const baseUrl = 'http://localhost:8080/api/v1/dropdowns';
    let url = `${baseUrl}/${endpoint}`;
    
    // Add ID to URL for specific operations
    if (id && (method === 'GET' || method === 'PUT' || method === 'DELETE')) {
      url += `/${id}`;
    }
    
    // Add pagination parameters for GET list requests
    if (method === 'GET' && !id && page !== undefined && size !== undefined) {
      url += `?page=${page}&size=${size}`;
    }
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add your authentication headers here if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    };
    
    // Add body for POST and PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      // Handle different response types
      if (method === 'DELETE') {
        return { success: true };
      }
      
      const result = await response.json();
      
      // Handle different response formats - check for content property first
      if (method === 'GET' && !id) {
        // List endpoint - handle paginated response with content property
        if (result.content && Array.isArray(result.content)) {
          return { 
            data: result.content, 
            total: result.totalElements || result.content.length,
            totalPages: result.totalPages || Math.ceil((result.totalElements || result.content.length) / (size || 20)),
            page: result.number || 0,
            size: result.size || size || 20
          };
        }
        // Fallback to data property or direct array
        const dataArray = Array.isArray(result) ? result : (result.data || []);
        return { 
          data: dataArray, 
          total: dataArray.length,
          totalPages: Math.ceil(dataArray.length / (size || 20)),
          page: 0,
          size: size || 20
        };
      }
      
      // Single item endpoints
      return result;
    } catch (error) {
      console.error(`API Error (${method} ${url}):`, error);
      throw error;
    }
  };

  const fetchData = async (entityType: EntityType, page?: number) => {
    setLoading(true);
    setError(null);
    try {
      const config = entityConfig[entityType];
      const currentPagination = pagination[entityType];
      const pageToFetch = page !== undefined ? page : currentPagination.page;
      
      const response = await apiCall('GET', config.endpoint, undefined, undefined, pageToFetch, currentPagination.size);
      
      // Handle different response formats from your API
      const dataArray = response.data || response.content || response;
      setData(prev => ({ ...prev, [entityType]: dataArray }));
      
      // Update pagination state
      setPagination(prev => ({
        ...prev,
        [entityType]: {
          page: response.page || pageToFetch,
          size: response.size || currentPagination.size,
          total: response.total || dataArray.length,
          totalPages: response.totalPages || Math.ceil((response.total || dataArray.length) / currentPagination.size)
        }
      }));
      
      // Also fetch countries for city dropdown (without pagination for dropdown)
      if (entityType === 'cities' || countries.length === 0) {
        const countriesResponse = await apiCall('GET', 'countries');
        const countriesArray = countriesResponse.data || countriesResponse.content || countriesResponse;
        setCountries(countriesArray);
      }
    } catch (err: any) {
      setError(`Failed to fetch ${entityConfig[entityType].title}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchData(activeTab, page);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        size: newSize,
        page: 0 // Reset to first page when changing size
      }
    }));
    fetchData(activeTab, 0);
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const config = entityConfig[activeTab];
      
      const createData = { ...formData };
      delete createData.id;
      delete createData.createdAt;
      delete createData.updatedAt;
      
      const response = await apiCall('POST', config.endpoint, createData);
      
      const newItem = response.data || response;
      
      setData(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));
      
      setShowModal(false);
      setFormData({});
      setError(null);
    } catch (err: any) {
      setError(`Failed to create item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);
      const config = entityConfig[activeTab];
      
      const updateData = { ...formData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const response = await apiCall('PUT', config.endpoint, updateData, selectedItem.id);
      
      const updatedItem = response.data || response;
      
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => 
          item.id === selectedItem.id ? updatedItem : item
        )
      }));
      
      setShowModal(false);
      setFormData({});
      setSelectedItem(null);
      setError(null);
    } catch (err: any) {
      setError(`Failed to update item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setLoading(true);
      const config = entityConfig[activeTab];
      await apiCall('DELETE', config.endpoint, undefined, id);
      
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
      setError(null);
    } catch (err: any) {
      setError(`Failed to delete item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (item: BaseEntity) => {
    try {
      setLoading(true);
      const config = entityConfig[activeTab];
      const updatedItem = { ...item, isActive: !item.isActive };
      
      delete updatedItem.createdAt;
      delete updatedItem.updatedAt;
      
      const response = await apiCall('PUT', config.endpoint, updatedItem, item.id);
      
      const responseItem = response.data || response;
      
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(existingItem => 
          existingItem.id === item.id ? responseItem : existingItem
        )
      }));
      setError(null);
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit', item?: BaseEntity) => {
    setModalMode(mode);
    setSelectedItem(item || null);
    setFormData(item ? { ...item } : { isActive: true });
    setShowModal(true);
  };

  const filteredData = data[activeTab].filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const renderField = (field: any) => {
    const value = formData[field.key] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder={field.label}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            rows={3}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.checked }))}
              className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 transition-colors"
            />
            <span className="text-slate-700">Active</span>
          </div>
        );
      case 'select':
        if (field.options === 'countries') {
          return (
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
              value={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: parseInt(e.target.value) }))}
            >
              <option value="">Select {field.label}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          );
        }
        return null;
      default:
        return (
          <input
            type={field.type}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder={field.label}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
            required={field.required}
          />
        );
    }
  };

  const getCountryName = (countryId: number) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string, hover: string, border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-100', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-700', hover: 'hover:bg-green-100', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:bg-purple-100', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', hover: 'hover:bg-orange-100', border: 'border-orange-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', hover: 'hover:bg-pink-100', border: 'border-pink-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', hover: 'hover:bg-indigo-100', border: 'border-indigo-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const renderPagination = () => {
    const currentPagination = pagination[activeTab];
    const { page, totalPages } = currentPagination;
    
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600">
            Showing {page * currentPagination.size + 1} to {Math.min((page + 1) * currentPagination.size, currentPagination.total)} of {currentPagination.total} results
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Page size:</span>
            <select
              value={currentPagination.size}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => page > 0 && handlePageChange(page - 1)}
                className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {pages.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => page < totalPages - 1 && handlePageChange(page + 1)}
                className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Master Data Management</h1>
          <p className="text-muted-foreground mt-1">Manage reference data for your application</p>
        </div>
      </div>
      
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="universities" className="space-y-6" onValueChange={(value) => setActiveTab(value as EntityType)}>
        <TabsList className="grid w-full grid-cols-6">
          {Object.entries(entityConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              {config.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(entityConfig).map(([key, config]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <CardTitle className="flex items-center text-xl">
                      <span className="text-2xl mr-2">{config.icon}</span>
                      {config.title}
                    </CardTitle>
                    <CardDescription>
                      Manage {config.title.toLowerCase()} in the system
                    </CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => fetchData(key as EntityType)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button
                      onClick={() => openModal('create')}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </button>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        {key === 'countries' && (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                        )}
                        {key === 'cities' && (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {loading ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-8 text-center">
                            <div className="flex justify-center items-center space-x-2">
                              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                              <span className="text-slate-500">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                            No data found
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                            {key === 'countries' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{(item as Country).code}</td>
                            )}
                            {key === 'cities' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                {(item as City).countryId ? getCountryName((item as City).countryId!) : '-'}
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{item.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleActiveStatus(item)}
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  item.isActive
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                } transition-colors`}
                              >
                                {item.isActive ? (
                                  <>
                                    <Eye className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(item.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(item.updatedAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => openModal('edit', item)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-up shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="text-2xl mr-2">{entityConfig[activeTab].icon}</span>
              {modalMode === 'create' ? 'Add New' : 'Edit'} {entityConfig[activeTab].title.slice(0, -1)}
            </h3>
            
            <div className="space-y-5">
              {entityConfig[activeTab].fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setFormData({});
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => modalMode === 'create' ? handleCreate() : handleUpdate()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default MasterDataManagement