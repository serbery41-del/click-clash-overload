import { useGameStore } from './store';
import DeviceSelect from './components/DeviceSelect';
import MenuScreen from './components/MenuScreen';
import SkinsScreen from './components/SkinsScreen';
import JoinRoom from './components/JoinRoom';
import LobbyScreen from './components/LobbyScreen';
import WaitingScreen from './components/WaitingScreen';
import GameScreen from './components/GameScreen';
import VictoryScreen from './components/VictoryScreen';

export default function App() {
  const phase = useGameStore(s => s.phase);

  switch (phase) {
    case 'deviceSelect':
      return <DeviceSelect />;
    case 'menu':
      return <MenuScreen />;
    case 'skins':
      return <SkinsScreen />;
    case 'joinRoom':
      return <JoinRoom />;
    case 'lobby':
      return <LobbyScreen />;
    case 'waiting':
      return <WaitingScreen />;
    case 'playing':
      return <GameScreen />;
    case 'finished':
      return <VictoryScreen />;
    default:
      return <DeviceSelect />;
  }
}
