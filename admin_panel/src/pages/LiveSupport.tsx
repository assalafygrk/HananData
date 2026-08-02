import React from 'react'

export const LiveSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Live Support Management</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          Agent Settings
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 h-[600px]">
          {/* Chat List */}
          <div className="col-span-1 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-700">Active Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg cursor-pointer border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">John Doe</span>
                  <span className="text-xs text-gray-500">2m ago</span>
                </div>
                <p className="text-xs text-gray-600 truncate">I'm having trouble with my PIN</p>
              </div>
              <div className="p-3 bg-white rounded-lg cursor-pointer border border-gray-100 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">Sarah Smith</span>
                  <span className="text-xs text-gray-500">1h ago</span>
                </div>
                <p className="text-xs text-gray-600 truncate">Is my verification done?</p>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-span-2 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800">John Doe</h2>
                <p className="text-xs text-gray-500">Handled by: AI Assistant (Gemini)</p>
              </div>
              <button className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium hover:bg-red-100">
                Take Over Interaction
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <div className="flex flex-col space-y-1 items-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700 max-w-md">
                  I'm having trouble with my PIN, it says invalid.
                </div>
                <span className="text-xs text-gray-400 ml-1">10:45 AM</span>
              </div>
              <div className="flex flex-col space-y-1 items-end">
                <div className="bg-primary-600 p-3 rounded-2xl rounded-tr-none text-white text-sm shadow-sm max-w-md">
                  I can help you reset your PIN. Please note that I cannot view your current PIN for security reasons. Would you like to receive a reset code?
                </div>
                <span className="text-xs text-gray-400 mr-1">10:45 AM (AI Response)</span>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to take over..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  disabled
                />
                <button disabled className="bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
