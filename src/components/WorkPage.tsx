import React from 'react'
import { Plane, CheckCircle, Clock, AlertTriangle, Navigation, ArrowLeft } from 'lucide-react'
import { useFAACategories } from '../hooks/useFAACategories'
import { FAACategorySection } from './FAACategorySection'

interface WorkPageProps {
  onNavigateBack: () => void
}

export function WorkPage({ onNavigateBack }: WorkPageProps) {
  const { faaCategories, loading, toggleFAATaskComplete, getFlightStatus } = useFAACategories()

  // Filter categories into incomplete and completed
  const incompleteCategories = faaCategories.filter(category => 
    !category.faa_tasks.every(task => task.user_progress?.completed)
  )
  
  const completedCategories = faaCategories.filter(category => 
    category.faa_tasks.every(task => task.user_progress?.completed)
  )

  const flightStatus = getFlightStatus()
  
  const getStatusIcon = () => {
    switch (flightStatus) {
      case 'Landed':
        return <CheckCircle className="w-8 h-8 text-green-400" />
      case 'Airborne':
        return <Plane className="w-8 h-8 text-blue-400" />
      case 'Taxiing':
        return <Navigation className="w-8 h-8 text-yellow-400" />
      default:
        return <Clock className="w-8 h-8 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (flightStatus) {
      case 'Landed':
        return 'from-green-600 to-green-700'
      case 'Airborne':
        return 'from-blue-600 to-blue-700'
      case 'Taxiing':
        return 'from-yellow-600 to-yellow-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  // Determine which categories should be locked based on sequential completion
  const getCategoryLockStatus = (categoryIndex: number) => {
    if (categoryIndex === 0) return false // First category is never locked
    
    // Check if all previous categories are complete
    for (let i = 0; i < categoryIndex; i++) {
      const category = faaCategories[i]
      const isComplete = category.faa_tasks.every(task => task.user_progress?.completed)
      if (!isComplete) {
        return true // This category should be locked
      }
    }
    return false
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1">
              <button
                onClick={onNavigateBack}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] text-sm sm:text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden xs:inline">Back to Dashboard</span>
                <span className="xs:hidden">Back</span>
              </button>
              
              <Plane className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              <div>
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900">Flight Operations</h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base hidden sm:block">FAA-Required Checklist Progress</p>
              </div>
            </div>
            
            {/* Flight Status Indicator in Header */}
            <div className={`px-2 sm:px-3 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full border-2 border-gray-300 bg-gradient-to-r ${getStatusColor()}`}>
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                {getStatusIcon()}
                <div className="text-white hidden sm:block">
                  <div className="text-xs sm:text-sm font-medium opacity-80 hidden md:block">Current Status</div>
                  <div className="text-xs sm:text-sm lg:text-lg font-bold">{flightStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-white/30 backdrop-blur-md mx-4 sm:mx-6 mb-4 lg:mb-8">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="animate-spin w-8 h-8 sm:w-12 sm:h-12 border-4 rounded-full border-gray-300 border-t-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Flight Status Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  {getStatusIcon()}
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                      <span className="hidden sm:inline">Current Status: </span>{flightStatus}
                    </h2>
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-lg leading-relaxed">
                      {flightStatus === 'Pre-Flight' && 'Complete taxi approval to begin taxiing'}
                      {flightStatus === 'Taxiing' && 'Complete takeoff approval to become airborne'}
                      {flightStatus === 'Airborne' && 'Complete landing approval to land safely'}
                      {flightStatus === 'Landed' && 'All flight operations completed successfully'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-gray-600 text-xs sm:text-sm mb-1">Overall Progress</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {Math.round((faaCategories.reduce((acc, cat) => 
                      acc + cat.faa_tasks.filter(task => task.user_progress?.completed).length, 0
                    ) / faaCategories.reduce((acc, cat) => acc + cat.faa_tasks.length, 0)) * 100) || 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              {faaCategories.map((category, index) => {
                const completedCount = category.faa_tasks.filter(task => task.user_progress?.completed).length
                const totalCount = category.faa_tasks.length
                const isComplete = completedCount === totalCount
                const isLocked = getCategoryLockStatus(index)
                
                return (
                  <div key={category.id} className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border transition-all duration-300 ${
                    isLocked 
                      ? 'border-yellow-500/30 opacity-60' 
                      : isComplete 
                        ? 'border-green-500/30' 
                        : 'border-blue-500/30'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-tight">{category.name}</h3>
                      {isLocked ? (
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      ) : isComplete ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      )}
                    </div>
                    
                    <div className="mb-2 sm:mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="text-xs sm:text-sm">{completedCount} of {totalCount}</span>
                        <span className="text-xs sm:text-sm font-medium">{Math.round((completedCount / totalCount) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                            isComplete 
                              ? 'bg-gradient-to-r from-green-400 to-green-500' 
                              : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                          }`}
                          style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {isLocked && 'Complete previous categories first'}
                      {!isLocked && !isComplete && 'In progress'}
                      {!isLocked && isComplete && 'Completed'}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Active Checklists */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Active Checklists</h2>
                  <div className="text-gray-600 text-xs sm:text-sm hidden sm:block">
                    Sequential order
                  </div>
                </div>

                {incompleteCategories.map((category, index) => {
                  const originalIndex = faaCategories.findIndex(cat => cat.id === category.id)
                  const isLocked = getCategoryLockStatus(originalIndex)
                  return (
                    <FAACategorySection
                      key={category.id}
                      category={category}
                      onToggleComplete={toggleFAATaskComplete}
                      isLocked={isLocked}
                      initialExpanded={true}
                    />
                  )
                })}

                {incompleteCategories.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">All Checklists Complete!</h3>
                    <p className="text-gray-600 text-sm sm:text-base px-4">Great job! All required checklists have been completed.</p>
                  </div>
                )}
              </div>

              {/* Right Column - Completed Checklists */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Completed Checklists</h2>
                  <div className="text-green-400 text-xs sm:text-sm">
                    {completedCategories.length} completed
                  </div>
                </div>

                {completedCategories.map((category) => (
                  <FAACategorySection
                    key={category.id}
                    category={category}
                    onToggleComplete={toggleFAATaskComplete}
                    isLocked={false}
                    initialExpanded={false}
                  />
                ))}

                {completedCategories.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">No Completed Checklists</h3>
                    <p className="text-gray-600 text-sm sm:text-base px-4">Completed checklists will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {faaCategories.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2">No FAA Categories Available</h3>
                <p className="text-gray-600 text-sm sm:text-base px-4">Contact your administrator to set up FAA required checklists.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}