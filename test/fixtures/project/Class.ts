export class Base {
	private withPrivAndInit = 'hello';
	private withPriv: obj<int>;
	readonly withRoAndInit = { na: 'object' };
	readonly withRo: int;
	noModifierAndInit = Infinity;
	noModifier: str[];

	constructor(paramNoInit: any, protected nameWithInit: str = 'init', paramWithInit = 10) {
		this.noModifier = [paramNoInit, paramWithInit];
		this.withPriv = { key: -5 };
		this.withRo = 1000;
	}

	someMethod() {
		return keys(this);
	}
}

export class Extended extends Base {
	protected isExtended = true;
}

export class SecondEx extends Base {
	constructor() {
		super(null);
	}

	someMethod() {
		return super.someMethod();
	}
}

function createClass() {
	return class Stuff {
		dummy() {
			return false;
		}
	};
}
