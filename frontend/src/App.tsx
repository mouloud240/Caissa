import { useState } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import ChatScreen from './components/ChatScreen'
import SettingsScreen from './components/SettingsScreen'
import './App.css'

type Screen = 'chat' | 'settings'

function App() {
  const [screen, setScreen] = useState<Screen>('chat')

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeScreen={screen} onNavigate={setScreen} />
        <main className="flex-1 overflow-hidden">
          {screen === 'chat' && <ChatScreen />}
          {screen === 'settings' && <SettingsScreen />}
        </main>
      </div>
    </div>
  )
}

export default App
