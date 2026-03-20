import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Activity, RefreshCw, CheckCircle2, XCircle, Settings } from 'lucide-react';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQa2PEE89r5KJW3lmNtSbA6eCj15BJD0UP7AOH47VUiuVVBWD8Hljaf-_VZS5IIwS4bwmbYt3sKv7dk/pub?output=csv';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  // 增加狀態管理
  const [csvUrl, setCsvUrl] = useState(SHEET_URL); // 初始值
  const [tempUrl, setTempUrl] = useState(csvUrl); // 用於輸入框暫存
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
        setLastRefreshed(new Date().toLocaleTimeString());
      },
      error: (error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  useEffect(() => {
    fetchData();
    // 每 60 秒自動刷新一次
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-blue-600" />
              Device Status Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Real-time monitoring of external assets</p>
          </div>

          {/* 將設定按鈕與重新整理按鈕放在同一個水平容器中 */}
          <div className="flex items-center gap-3">
            {/* 設定按鈕 (含彈出視窗) */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50 transition-all"
              >
                <Settings size={20} className="text-gray-600" />
              </button>

              {/* 設定彈出視窗 (維持原功能) */}
              {showSettings && (
                <div className="absolute right-0 top-12 w-80 bg-white p-4 rounded-xl shadow-lg border z-10">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CSV Source URL</label>
                  <input 
                    type="text" 
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="w-full p-2 border rounded mb-3 text-sm"
                  />
                  <button 
                    onClick={() => { setCsvUrl(tempUrl); setShowSettings(false); }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    Update Source
                  </button>
                </div>
              )}
            </div>

            {/* 重新整理按鈕 */}
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatusCard 
            title="Total Devices" 
            value={data.length} 
            color="blue" 
          />
          <StatusCard 
            title="Online" 
            value={data.filter(d => d.Status?.toLowerCase() === 'online').length} 
            color="green" 
          />
          <StatusCard 
            title="Offline" 
            value={data.filter(d => d.Status?.toLowerCase() === 'offline').length} 
            color="red" 
          />
        </div>

        {/* Data Table / List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Device Name", "Model", "Status", "Last Updated"].map((col) => (
                  <th 
                    key={col}
                    onClick={() => handleSort(col)}
                    className="px-6 py-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors select-none"
                  >
                    {col} {sortConfig.key === col ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">Loading data...</td>
                </tr>
              ) : (
                data.map((device, idx) => (
                  <DeviceRow key={idx} device={device} />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <p className="mt-4 text-xs text-gray-400 text-right">
          Last updated: {lastRefreshed || 'Never'}
        </p>
      </div>
    </div>
  );
}

// 狀態卡片：顯示摘要資訊
function StatusCard({ title, value, color }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} shadow-sm`}>
      <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

// 裝置列：顯示單一裝置狀態與 Indicators
function DeviceRow({ device }) {
  const isOnline = device.Status?.toLowerCase() === 'online';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-800">{device["Device Name"] || 'Unknown'}</td>
      <td className="px-6 py-4 text-gray-500 text-sm">{device.Model || 'N/A'}</td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isOnline 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-rose-100 text-rose-700'
          }`}>
            {isOnline ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {device.Status?.toUpperCase() || 'OFFLINE'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm italic">
        {device["Last Updated"] || 'No record'}
      </td>
    </tr>
  );
}

export default App;