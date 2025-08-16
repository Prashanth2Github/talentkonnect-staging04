import React, { useState, useEffect } from 'react';
import { Heart, Star, Award, Check, TrendingUp } from 'lucide-react';

const FeedModule = () => {
  // State management
  const [feedItems, setFeedItems] = useState([]);
  const [userCredits, setUserCredits] = useState(124);
  const [lastVisitTime, setLastVisitTime] = useState(Date.now() - 3600000); // 1 hour ago
  const [loading, setLoading] = useState(true);

  // Mock API - GET /api/feed
  const fetchFeed = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockFeedData = [
      {
        id: 1,
        type: 'tip',
        user: 'Sarah M.',
        avatar: '👩‍💼',
        timestamp: Date.now() - 300000, // 5 minutes ago
        content: 'Quick tip: Use the Pomodoro technique for micro-tasks. 25 minutes focused work, 5 minute break. Perfect for TalentKonnect gigs!',
        upvotes: 12,
        hasUpvoted: false,
        isNew: true
      },
      {
        id: 2,
        type: 'gig',
        user: 'Mike R.',
        avatar: '👨‍💻',
        timestamp: Date.now() - 900000, // 15 minutes ago
        content: 'Just completed a logo design review gig in 10 minutes. Easy $15 + 3 credits!',
        upvotes: 8,
        hasUpvoted: false,
        isNew: true
      },
      {
        id: 3,
        type: 'completion',
        user: 'Lisa K.',
        avatar: '👩‍🎨',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        content: 'Finished transcribing a 5-minute audio clip. These quick tasks are perfect for my schedule!',
        upvotes: 15,
        hasUpvoted: false,
        isNew: false
      },
      {
        id: 4,
        type: 'tip',
        user: 'David L.',
        avatar: '👨‍🏫',
        timestamp: Date.now() - 3600000, // 1 hour ago
        content: 'Pro tip: Keep a notepad nearby while doing gigs. Jot down ideas for your own tips to share later!',
        upvotes: 23,
        hasUpvoted: false,
        isNew: false
      },
      {
        id: 5,
        type: 'gig',
        user: 'Emma T.',
        avatar: '👩‍🔬',
        timestamp: Date.now() - 5400000, // 1.5 hours ago
        content: 'Quick product description writing task done! Love how these micro-gigs fit into my day.',
        upvotes: 6,
        hasUpvoted: true,
        isNew: false
      },
      {
        id: 6,
        type: 'tip',
        user: 'Alex P.',
        avatar: '👨‍🎨',
        timestamp: Date.now() - 7200000, // 2 hours ago
        content: 'When doing writing gigs, always read the brief twice. Saves time on revisions!',
        upvotes: 18,
        hasUpvoted: false,
        isNew: false
      },
      {
        id: 7,
        type: 'completion',
        user: 'Maya S.',
        avatar: '👩‍💻',
        timestamp: Date.now() - 10800000, // 3 hours ago
        content: 'Completed a social media post review in 8 minutes. These bite-sized tasks are addictive!',
        upvotes: 11,
        hasUpvoted: false,
        isNew: false
      }
    ];
    
    setFeedItems(mockFeedData);
    setLoading(false);
  };

  // Mock API - POST /api/upvotes
  const submitUpvote = async (itemId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Update local state
    setFeedItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId && !item.hasUpvoted) {
          return {
            ...item,
            upvotes: item.upvotes + 1,
            hasUpvoted: true
          };
        }
        return item;
      })
    );
    
    // Award credit
    setUserCredits(prev => prev + 1);
    
    // Show success feedback
    showUpvoteSuccess();
  };

  // Success feedback
  const showUpvoteSuccess = () => {
    // In a real app, this would be a toast notification
    console.log('Upvote successful! +1 Credit earned');
  };

  // Initialize feed
  useEffect(() => {
    fetchFeed();
  }, []);

  // Format timestamp
  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  // Get type icon and color
  const getTypeIcon = (type) => {
    switch (type) {
      case 'tip': 
        return { icon: <Star className="w-4 h-4" />, color: '#F59E0B', bg: '#FEF3C7' };
      case 'gig': 
        return { icon: <Award className="w-4 h-4" />, color: '#10B981', bg: '#D1FAE5' };
      case 'completion': 
        return { icon: <Check className="w-4 h-4" />, color: '#3B82F6', bg: '#DBEAFE' };
      default: 
        return { icon: <TrendingUp className="w-4 h-4" />, color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F1FAEE' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                   style={{ backgroundColor: '#1D3557' }}>
                TK
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span style={{ color: '#1D3557' }}>talent</span>
                  <span style={{ color: '#E76F51' }}>konnect</span>
                </h1>
                <p className="text-sm text-gray-500">Feed & Discovery</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white font-semibold"
                 style={{ backgroundColor: '#E76F51' }}>
              <Award className="w-4 h-4" />
              <span>{userCredits} Credits</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#1D3557' }}>
              Community Feed
            </h2>
            <button
              onClick={fetchFeed}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <TrendingUp className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
          
          <p className="text-gray-600">
            Latest tips, gigs, and completions from the community. Upvote to earn credits!
          </p>
        </div>

        {/* Feed Items */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            feedItems.map((item) => {
              const typeInfo = getTypeIcon(item.type);
              
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                    item.isNew && item.timestamp > lastVisitTime ? 'ring-2 ring-orange-200' : ''
                  }`}
                  style={{ 
                    boxShadow: '2px 2px 0px rgba(0,0,0,0.05)',
                    borderRadius: '12px'
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        {item.avatar}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{item.user}</span>
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                             style={{ backgroundColor: typeInfo.bg, color: typeInfo.color }}>
                          {typeInfo.icon}
                          <span className="capitalize">{item.type}</span>
                        </div>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatTime(item.timestamp)}</span>
                        {item.isNew && item.timestamp > lastVisitTime && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: '#FFF7ED', color: '#E76F51' }}>
                            New
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => submitUpvote(item.id)}
                          disabled={item.hasUpvoted}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            item.hasUpvoted
                              ? 'bg-orange-50 text-orange-600 cursor-not-allowed'
                              : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: item.hasUpvoted ? '#FFF7ED' : '#F9FAFB',
                            color: item.hasUpvoted ? '#E76F51' : '#6B7280',
                            borderRadius: '8px'
                          }}
                        >
                          <Heart className={`w-4 h-4 transition-all ${item.hasUpvoted ? 'fill-current text-red-500' : ''}`} />
                          <span>{item.upvotes}</span>
                          <span>{item.hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
                        </button>
                        
                        {!item.hasUpvoted && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Award className="w-3 h-3" />
                            <span>+1 Credit</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {!loading && feedItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchFeed}
              className="px-6 py-3 rounded-lg border-2 font-medium transition-all hover:scale-105"
              style={{ 
                borderColor: '#E76F51',
                color: '#E76F51',
                borderRadius: '8px'
              }}
            >
              Load More Posts
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && feedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share a tip or complete a gig!</p>
            <button
              onClick={fetchFeed}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#E76F51', borderRadius: '8px' }}
            >
              Refresh Feed
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedModule;
