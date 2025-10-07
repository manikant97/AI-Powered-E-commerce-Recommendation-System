const Dashboard = () => {
  const metrics = {
    totalCustomers: 1250,
    totalOrders: 3500,
    revenue: '$250,000',
    conversionRate: '25%',
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200"
          >
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{key.replace(/([A-Z])/g, ' $1')}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 text-xl">📊</span>
              </div>
            </div>
          ))}
        </div>
  
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">New Customer Registration</h3>
                <p className="text-sm text-gray-500">John Doe registered</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                New
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Order Placed</h3>
                <p className="text-sm text-gray-500">Order #123456</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  