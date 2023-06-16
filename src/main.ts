import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

/* This the main class of the Phaser Framework, where the game variable is configured and the scene are loaded.  
*/
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1500,
	height: 800,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	},
	scene: [HelloWorldScene]
};

export default new Phaser.Game(config)
