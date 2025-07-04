import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getTimeOfDay } from '../utils/timeUtils';
import { 
  ChevronLeft, 
  Home, 
  User, 
  Settings, 
  Crown, 
  LogIn, 
  SkipForward, 
  Shuffle, 
  Archive, 
  Sparkles,
  Video,
  VideoOff,
  RotateCcw
} from 'lucide-react';

interface UniversalNavigationProps {
  videoEnabled?: boolean;
  onToggleVideo?: () => void;
  onNextScene?: () => void;
  onRandomScene?: () => void;
  onNewSession?: () => void;
  onNavigateHome?: () => void;
  currentScene?: string;
  sessionType?: 'morning' | 'evening';
}

const UniversalNavigation: React.FC<UniversalNavigationProps> = ({
  videoEnabled,
  onToggleVideo,
  onNextScene,
  onRandomScene,
  onNewSession,
  onNavigateHome,
  currentScene,
  sessionType
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isGuest, loading } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const timeOfDay = getTimeOfDay(profile?.name);
  
  // Use sessionType prop if provided, otherwise derive from timeOfDay
  const currentSessionType = sessionType || (timeOfDay.period === 'morning' ? 'morning' : 'evening');

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getTextColor = () => {
    return currentSessionType === 'morning' ? 'text-gray-700' : 'text-white';
  };

  const getButtonStyle = () => {
    return currentSessionType === 'morning'
      ? 'bg-white/20 hover:bg-white/30 text-gray-700'
      : 'bg-white/10 hover:bg-white/20 text-white';
  };

  // Determine current page for active indicators
  const isHome = location.pathname === '/' || location.pathname === '/session';
  const isInsights = location.pathname === '/insights';
  const isArchive = location.pathname === '/archive';
  const isSettings = location.pathname === '/settings';

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Home/Back Navigation */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              {onNavigateHome ? (
                <button
                  onClick={onNavigateHome}
                  className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                  title="Back to home"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/session')}
                  className={`p-2 rounded-xl backdrop-blur-sm border ${
                    isHome ? 'border-amber-400/50' : 'border-white/20'
                  } transition-all duration-200 ${getButtonStyle()}`}
                  title="Home"
                >
                  <Home className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => navigate('/insights')}
                className={`p-2 rounded-xl backdrop-blur-sm border ${
                  isInsights ? 'border-amber-400/50' : 'border-white/20'
                } transition-all duration-200 ${getButtonStyle()}`}
                title="Insights Gallery"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/archive')}
                className={`p-2 rounded-xl backdrop-blur-sm border ${
                  isArchive ? 'border-amber-400/50' : 'border-white/20'
                } transition-all duration-200 ${getButtonStyle()}`}
                title="Chat Archive"
              >
                <Archive className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center - Scene Controls (only show if we have scene controls) */}
        <AnimatePresence>
          {showControls && (currentScene || onNextScene) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              {currentScene && (
                <div className={`px-3 py-1 rounded-xl backdrop-blur-sm border border-white/20 ${getButtonStyle()}`}>
                  <span className="text-xs font-medium">{currentScene}</span>
                </div>
              )}

              {onNextScene && (
                <button
                  onClick={onNextScene}
                  className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                  title="Next scene"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {onRandomScene && (
                <button
                  onClick={onRandomScene}
                  className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                  title="Random scene"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              )}

              {onToggleVideo && (
                <button
                  onClick={onToggleVideo}
                  className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                  title={videoEnabled ? "Disable video background" : "Enable video background"}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              )}

              {onNewSession && (
                <button
                  onClick={onNewSession}
                  className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                  title="New session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side - User Controls */}
        <AnimatePresence>
          {showControls && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              {/* Guest User - Show Sign In/Sign Up button only */}
              {!user && !isGuest && (
                <button
                  onClick={() => navigate('/auth')}
                  className={`px-3 py-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center gap-1 ${getButtonStyle()}`}
                  title="Sign In"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Sign In</span>
                </button>
              )}

              {/* Guest User - Show Sign Up prompt */}
              {isGuest && (
                <button
                  onClick={() => navigate('/auth')}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-all duration-200 flex items-center gap-1"
                  title="Create free account to save your data"
                >
                  Sign Up
                </button>
              )}

              {/* Logged In User - Show full navigation */}
              {user && (
                <div className="flex items-center gap-2">
                  {/* Settings Button - Always visible for logged in users */}
                  <button
                    onClick={() => navigate('/settings')}
                    className={`p-2 rounded-xl backdrop-blur-sm border ${
                      isSettings ? 'border-amber-400/50' : 'border-white/20'
                    } transition-all duration-200 ${getButtonStyle()}`}
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  {/* Pro Upgrade Button - Only for free users */}
                  {profile?.is_pro !== true && (
                    <button
                      onClick={() => navigate('/upgrade')}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium transition-all duration-200 flex items-center gap-1"
                      title="Upgrade to Pro"
                    >
                      <Crown className="w-4 h-4" />
                      <span className="hidden sm:inline">Pro</span>
                    </button>
                  )}

                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button
                      className={`p-2 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 ${getButtonStyle()}`}
                      title={user?.email || 'User menu'}
                    >
                      <User className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl backdrop-blur-sm border border-white/20 bg-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="p-2">
                        <div className={`px-3 py-2 text-xs ${getTextColor()}/80`}>
                          {user?.email}
                        </div>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-white/10 ${getTextColor()}`}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Loading state */}
          {showControls && loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className={`px-3 py-2 rounded-xl backdrop-blur-sm border border-white/20 ${getButtonStyle()}`}>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UniversalNavigation;