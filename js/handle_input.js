const handleInput = function (hero, keysDown) {
	if (hero.dying || hero.attacking) {return;}

	// Stop moving the hero
	hero.stop();
	// if (hero.shakingAss) {hero.face("N");}

	if (83 in keysDown) { // S
		hero.shakeAssOn();

	}

	if (37 in keysDown) { // Left
		hero.go("W");
	}

	if (38 in keysDown) { // Up
		hero.go("N");
	}


	if (39 in keysDown) { // Right
		hero.go("E");
	}


	if (40 in keysDown) { // Down
		hero.go("S");
	}

	if (38 in keysDown && 39 in keysDown) { // Up/Right
		hero.go("NE");
	}

	if (38 in keysDown && 37 in keysDown) { // Up/Left
		hero.go("NW");
	}

	if (40 in keysDown && 39 in keysDown) { // Down/Right
		hero.go("SE");
	}

	if (40 in keysDown && 37 in keysDown) { // Down/Left
		hero.go("SW");
	}
	if (32 in keysDown) { // space
		hero.attack();
	}


};

module.exports = handleInput;
