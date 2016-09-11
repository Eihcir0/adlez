const handleInput = function (hero, keysDown) {

	// Stop moving the hero
	hero.stop();
	if (hero.shakingAss) {hero.face("N");}


	if (37 in keysDown) { // Left
		hero.face("W");
	}

	if (38 in keysDown) { // Up
		hero.face("N");
	}

	if (32 in keysDown) { // space
    hero.shakeAssOn();

	}

	if (39 in keysDown) { // Right
		hero.face("E");
	}

	if (40 in keysDown) { // Down
		hero.face("S");
	}

	if (38 in keysDown && 39 in keysDown) { // Up/Right
		hero.face("NE");
	}

	if (38 in keysDown && 37 in keysDown) { // Up/Left
		hero.face("NW");
	}

	if (40 in keysDown && 39 in keysDown) { // Down/Right
		hero.face("SE");
	}

	if (40 in keysDown && 37 in keysDown) { // Down/Left
		hero.face("SW");
	}



};

module.exports = handleInput;
