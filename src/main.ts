import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

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

//export default config
