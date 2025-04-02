import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getUserUrls } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clipboard, QrCode, ExternalLink } from 'lucide-react';

// Function to generate color from hash
const generateColorFromHash = (hash) => {
  // Simple hash function to generate a consistent color
  let hashNum = 0;
  for (let i = 0; i < hash.length; i++) {
    hashNum = hash.charCodeAt(i) + ((hashNum << 5) - hashNum);
  }
  
  const c = (hashNum & 0x00FFFFFF)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');
  
  return `#${c}`;
};

// Custom Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

// Custom Card Header
const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b ${className}`}>
    {children}
  </div>
);

// Custom Card Title
const CardTitle = ({ children }) => (
  <h3 className="text-xl font-semibold text-gray-800">{children}</h3>
);

// Custom Card Content
const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

// Custom Tabs Component
const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  // Clone children and pass activeTab state
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });
  
  return (
    <div className={`${className}`}>
      {childrenWithProps}
    </div>
  );
};

// Custom TabsList Component
const TabsList = ({ children, className = "", activeTab, setActiveTab }) => (
  <div className={`flex bg-gray-100 rounded-md p-1 ${className}`}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeTab, setActiveTab });
      }
      return child;
    })}
  </div>
);

// Custom TabsTrigger Component
const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
  <button
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
      activeTab === value 
        ? 'bg-white shadow text-black' 
        : 'text-gray-600 hover:text-gray-900'
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

// Custom TabsContent Component
const TabsContent = ({ children, value, activeTab }) => (
  <div className={`mt-4 ${activeTab === value ? 'block' : 'hidden'}`}>
    {children}
  </div>
);

const Dashboard = () => {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ["userUrls"], queryFn: getUserUrls });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  const barChartData = data.urls.map(url => ({
    name: url.shortUrl,
    visits: url.visits,
    color: generateColorFromHash(url.shortUrl)
  }));

  const pieChartData = data.urls.map(url => ({
    name: url.shortUrl,
    value: url.visits,
    color: generateColorFromHash(url.shortUrl)
  }));

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(window.location.origin + '/redirect/' + text)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  // Handle URL selection for QR code display
  const handleUrlSelect = (url) => {
    setSelectedUrl(url);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">URL Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data.urls.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {data.urls.reduce((sum, url) => sum + url.visits, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg. Visits per URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {(data.urls.reduce((sum, url) => sum + url.visits, 0) / data.urls.length || 0).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>URL Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bar">
              <TabsList className="mb-4">
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bar">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="pie">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({name}) => name}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUrl ? (
              <div className="flex flex-col items-center justify-center h-64">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/redirect/' + selectedUrl.shortUrl)}`} 
                  alt="QR Code"
                  className="mb-4"
                />
                <p className="text-center">Scan to visit: {selectedUrl.shortUrl}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <QrCode size={64} className="mx-auto mb-3 opacity-50" />
                  <p>Select a URL to generate QR code</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Shortened URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Short URL</th>
                  <th className="text-left p-2">Visits</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.urls.map((url) => (
                  <tr key={url._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-2" 
                          style={{ backgroundColor: generateColorFromHash(url.shortUrl) }}
                        ></div>
                        <a 
                          href={`/${url.shortUrl}`} 
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {url.shortUrl}
                        </a>
                      </div>
                    </td>
                    <td className="p-2">{url.visits}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copy URL"
                        >
                          <Clipboard size={16} />
                        </button>
                        <button 
                          onClick={() => handleUrlSelect(url)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Show QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                        <a 
                          href={`/redirect/${url.shortUrl}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Visit URL"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;