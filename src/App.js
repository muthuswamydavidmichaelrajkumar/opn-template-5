import React, { useState, useEffect } from 'react';
import { Search, User, ChevronDown, ChevronRight, Book, FileText, HelpCircle, Terminal, Clock, Star } from 'lucide-react';

const OpnDocsUI = () => {
  const [activePage, setActivePage] = useState('Documents');
  const [activeSubPage, setActiveSubPage] = useState('');
  const [selectedAPIVersion, setSelectedAPIVersion] = useState('v1.0');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [rating, setRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedItems, setExpandedItems] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, text: "Great documentation!", date: new Date('2024-03-01'), isOpen: true },
    { id: 2, text: "Could use more examples.", date: new Date('2024-03-02'), isOpen: true }
  ]);

  const mainMenuItems = [
    { name: 'Documents', icon: Book },
    { name: 'Articles', icon: FileText },
    { name: 'FAQs', icon: HelpCircle },
    { name: 'API Playground', icon: Terminal },
    { name: 'Changelog', icon: Clock }
  ];

  const sidebarItems = {
    Documents: {
      'Getting Started': {
        'Introduction': {
          'Overview': ['What is Opn Docs', 'Key Features'],
          'Getting Access': ['Sign Up', 'API Keys']
        },
        'Quick Start': {
          'Setup': ['Installation', 'Configuration'],
          'First API Call': ['Authentication', 'Making a Request']
        }
      },
      'Core Concepts': {
        'Authentication': {
          'API Keys': ['Obtaining Keys', 'Using Keys'],
          'OAuth': ['Setup', 'Token Management']
        },
        'Webhooks': {
          'Configuration': ['Setting Up', 'Testing'],
          'Events': ['Available Events', 'Payload Structure']
        }
      }
    },
    Articles: {
      'Best Practices': {
        'Security': ['API Key Management', 'Data Encryption'],
        'Performance': ['Caching', 'Rate Limiting']
      },
      'Tutorials': {
        'Basic Integration': ['Setting Up', 'First Transaction'],
        'Advanced Features': ['Recurring Payments', 'Disputes Handling']
      },
      'Case Studies': {
        'E-commerce': ['Implementation', 'Results'],
        'SaaS': ['Integration Process', 'Benefits']
      }
    },
    FAQs: {
      'Account': {
        'Registration': ['How to Sign Up', 'Account Verification'],
        'Billing': ['Pricing Plans', 'Payment Methods']
      },
      'Integration': {
        'SDK': ['Supported Languages', 'Installation Guide'],
        'API': ['Endpoints Overview', 'Common Errors']
      },
      'Troubleshooting': {
        'Common Issues': ['Connection Problems', 'Authentication Errors'],
        'Error Codes': ['4xx Errors', '5xx Errors']
      }
    },
    Changelog: {
      '2024': {
        'March': ['Feature Updates', 'Bug Fixes'],
        'February': ['New Integrations', 'Performance Improvements'],
        'January': ['API v2.0 Release', 'Deprecated Features']
      },
      '2023': {
        'December': ['Year-End Updates', 'Security Enhancements'],
        'November': ['New Payment Methods', 'SDK Updates'],
        'October': ['Documentation Overhaul', 'API Additions']
      }
    }
  };

  useEffect(() => {
    if (activePage !== 'API Playground') {
      const currentSidebarItems = sidebarItems[activePage];
      if (currentSidebarItems && Object.keys(currentSidebarItems).length > 0) {
        const firstCategory = Object.keys(currentSidebarItems)[0];
        setActiveSubPage(firstCategory);
      } else {
        setActiveSubPage('');
      }
    } else {
      setActiveSubPage('');
    }
  }, [activePage]);

  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, text: newComment, date: new Date(), isOpen: true }]);
      setNewComment('');
    }
  };

  const toggleComment = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, isOpen: !comment.isOpen } : comment
    ));
  };

  const renderSidebarItems = (items, path = '', depth = 0) => {
    if (!items || typeof items !== 'object') {
      return null;
    }

    return Object.entries(items).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const isExpanded = expandedItems[currentPath];
      const isLeaf = depth === 3 || (activePage === 'Changelog' && depth === 2) || Array.isArray(value);
      
      return (
        <div key={currentPath} className={`my-1 ${depth > 0 ? 'ml-4' : ''}`}>
          <div 
            className={`flex items-center cursor-pointer hover:text-teal-300 transition-colors duration-200 ${isLeaf ? 'ml-6' : ''}`}
            onClick={() => {
              if (!isLeaf) {
                toggleExpand(currentPath);
              }
              setActiveSubPage(currentPath);
            }}
          >
            {!isLeaf && (isExpanded ? <ChevronDown size={16} className="text-teal-400 mr-2" /> : <ChevronRight size={16} className="text-teal-400 mr-2" />)}
            <span>{key}</span>
          </div>
          {!isLeaf && isExpanded && (
            <div className="mt-1">
              {renderSidebarItems(value, currentPath, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSidebar = () => {
    if (activePage === 'API Playground') {
      return null;
    }

    return (
      <div className="w-64 bg-gray-900 p-4 h-screen overflow-y-auto rounded-tr-3xl shadow-lg border-r border-teal-500/30">
        <h2 className="text-2xl font-bold mb-4 text-teal-300">{activePage}</h2>
        {renderSidebarItems(sidebarItems[activePage])}
      </div>
    );
  };

  const renderMainContent = () => {
    const sortedComments = [...comments].sort((a, b) => 
      sortOrder === 'desc' ? b.date - a.date : a.date - b.date
    );

    return (
      <div className={`flex-1 p-6 overflow-y-auto bg-gray-800 text-gray-200 ${activePage === 'API Playground' ? 'w-full' : ''}`}>
        <h2 className="text-3xl font-bold mb-4 text-teal-300">{activeSubPage || activePage}</h2>
        <p className="text-gray-400">Content for {activeSubPage || activePage} in {activePage} goes here...</p>
        
        <div className="mt-4 flex space-x-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 border rounded-full bg-gray-700 text-teal-300 border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="English">English</option>
            <option value="Japanese">日本語</option>
            <option value="Thai">ไทย</option>
          </select>

          {activePage === 'Documents' && (
            <select
              value={selectedAPIVersion}
              onChange={(e) => setSelectedAPIVersion(e.target.value)}
              className="p-2 border rounded-full bg-gray-700 text-teal-300 border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>v1.0</option>
              <option>v2.0</option>
              <option>v3.0</option>
            </select>
          )}
        </div>

        {activePage === 'API Playground' ? (
          <div className="mt-8 bg-gray-900 p-6 rounded-3xl shadow-md border border-teal-500/30">
            <h3 className="text-xl font-semibold mb-4 text-teal-300">API Playground</h3>
            <p className="text-gray-400">Interactive API testing environment goes here...</p>
          </div>
        ) : (
          <>
            <div className="mt-8 bg-gray-900 p-6 rounded-3xl shadow-md border border-teal-500/30">
              <h3 className="text-xl font-semibold mb-2 text-teal-300">Rate this content:</h3>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    fill={star <= rating ? "#5eead4" : "none"}
                    stroke="#5eead4"
                    className="cursor-pointer mr-1"
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <p className="mt-2 text-gray-400">Overall rating: {rating}/5</p>
            </div>

            <div className="mt-8 bg-gray-900 p-6 rounded-3xl shadow-md border border-teal-500/30">
              <h3 className="text-xl font-semibold mb-4 text-teal-300">Comments</h3>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-xl mb-2 bg-gray-700 text-gray-200 border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="4"
                  placeholder="Enter your comment..."
                ></textarea>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-l-xl bg-gray-700 text-gray-200 border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter CAPTCHA"
                  />
                  <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-r-xl hover:bg-teal-700 transition-colors duration-200">
                    Post Comment
                  </button>
                </div>
              </form>
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-teal-300">All Comments</h4>
                <button
                  className="text-teal-400 underline mb-2 hover:text-teal-300"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                </button>
                {sortedComments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-700 py-2">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleComment(comment.id)}>
                      <p className="text-gray-400">{comment.isOpen ? '▼' : '▶'} {comment.date.toLocaleString()}</p>
                    </div>
                    {comment.isOpen && <p className="mt-2 text-gray-300">{comment.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-200">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-teal-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-4">Opn Docs</h1>
          <span className="text-lg">{activePage} {activeSubPage ? `- ${activeSubPage}` : ''}</span>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="py-1 px-3 pr-8 rounded-full text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <User className="cursor-pointer text-teal-300" size={24} />
        </div>
      </div>

      {/* Main Menu */}
      <div className="bg-gray-900 p-2 flex justify-center shadow-md">
        {mainMenuItems.map((item) => (
          <button
            key={item.name}
            className={`px-4 py-2 rounded-full mx-2 flex items-center ${
              activePage === item.name 
                ? 'bg-teal-900/50 text-teal-300' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-teal-300'
            } transition-colors duration-200`}
            onClick={() => {
              setActivePage(item.name);
              setActiveSubPage('');
              setExpandedItems({});
            }}
          >
            <item.icon size={18} className="mr-2" />
            {item.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default OpnDocsUI;