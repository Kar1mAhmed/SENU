// Dashboard messages page with table layout
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { contactAPI } from '@/lib/api-client';
import { ContactMessage, ContactMessageStatus } from '@/lib/types';

console.log('📬 Messages dashboard page loaded with table layout!');

const MessagesPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | 'all'>('all');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login...');
      router.push('/dashboard/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load messages function
  const loadMessages = useCallback(async () => {
    if (!isAuthenticated) return;
    
    console.log('📋 Loading messages with filter:', statusFilter);
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await contactAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100
      });
      
      if (response && response.items) {
        setMessages(response.items);
        console.log(`✅ Loaded ${response.items.length} messages`);
      } else {
        console.log('⚠️ No data received from API');
        setMessages([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      console.error('❌ Error loading messages:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, statusFilter]);

  // Load messages on mount and filter change
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleUpdateStatus = async (messageId: string, newStatus: ContactMessageStatus) => {
    console.log('🔄 Updating message status:', messageId, 'to', newStatus);
    
    try {
      await contactAPI.updateStatus(messageId, newStatus);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, status: newStatus } : m
      ));
      console.log('✅ Message status updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      console.error('❌ Error updating status:', errorMessage);
      alert(`Error updating status: ${errorMessage}`);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    console.log('🗑️ Deleting message:', messageId);
    
    try {
      await contactAPI.delete(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      console.log('✅ Message deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      console.error('❌ Error deleting message:', errorMessage);
      alert(`Error deleting message: ${errorMessage}`);
    }
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessage(prev => prev === messageId ? null : messageId);
    
    // Mark as read when expanded
    const message = messages.find(m => m.id === messageId);
    if (message && message.status === 'new') {
      handleUpdateStatus(messageId, 'read');
    }
  };

  const formatDate = (date: Date) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getAllContactInfo = (message: ContactMessage) => {
    // Show all available contact info
    const parts = [];
    if (message.email) parts.push(message.email);
    if (message.phoneNumber) parts.push(`${message.countryCode || ''} ${message.phoneNumber}`.trim());
    return parts.length > 0 ? parts.join(' • ') : 'N/A';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const newCount = messages.filter(m => m.status === 'new').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-glass-fill backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-new-black text-2xl font-light">
            Messages
          </h1>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Status Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Filter by Status</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                statusFilter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              New ({newCount})
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                statusFilter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Read ({readCount})
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                statusFilter === 'archived'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Archived ({archivedCount})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading messages...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Messages Table */}
        {!loading && !error && (
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No messages found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/30 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {messages.map((message) => (
                      <React.Fragment key={message.id}>
                        <tr 
                          className={`hover:bg-white/5 transition-colors ${
                            message.status === 'new' ? 'bg-blue-500/5' : ''
                          }`}
                        >
                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={message.status}
                              onChange={(e) => handleUpdateStatus(message.id, e.target.value as ContactMessageStatus)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                                message.status === 'new' ? 'bg-blue-600/20 text-blue-400' :
                                message.status === 'read' ? 'bg-green-600/20 text-green-400' :
                                'bg-gray-600/20 text-gray-400'
                              }`}
                            >
                              <option value="new">NEW</option>
                              <option value="read">READ</option>
                              <option value="archived">ARCHIVED</option>
                            </select>
                          </td>

                          {/* Name */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white">{message.name}</div>
                          </td>

                          {/* Contact Info */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300">
                              {getAllContactInfo(message)}
                            </div>
                          </td>

                          {/* Method */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-400">
                              {message.contactMethod.toUpperCase()}
                            </span>
                          </td>

                          {/* Message Preview */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-400 max-w-xs truncate">
                              {message.message || <span className="italic">No message</span>}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {formatDate(message.createdAt)}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleMessageExpansion(message.id)}
                                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                                title="View Details"
                              >
                                <svg 
                                  className={`w-4 h-4 transform transition-transform duration-200 ${
                                    expandedMessage === message.id ? 'rotate-180' : ''
                                  }`} 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedMessage === message.id && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-black/20">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-400 mb-2">Full Message:</h4>
                                  {message.message ? (
                                    <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                                  ) : (
                                    <p className="text-gray-500 italic">No message provided</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>Message ID: {message.id}</span>
                                  <span>•</span>
                                  <span>Created: {formatDate(message.createdAt)}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
