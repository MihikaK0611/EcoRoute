import { AppRegistry } from 'react-native';
import App from './App';

// The name 'EcoRoute' should match the one in your app.json or native project settings
AppRegistry.registerComponent('EcoRoute', () => App);

// Bootstrap the app on the web
AppRegistry.runApplication('EcoRoute', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
