/* eslint-disable no-undef */
export default (name, prototype, staticProto, __super__) => {
	map(
		['name', 'prototype', '__proto__', '__static__', '__super__', '__class__', '__new__'],
		(p) => {
			exists(staticProto, p) && die(`${name}: '${p}' is a reserved static property name`);
		}
	);
	let Class,
		__proto__ = prototype,
		__static__ = staticProto;
	// print('--------------------------------------------------------------------------------\n');
	// printf(`[${name}.prototype]: %.2J\n`, __proto__);
	// print('--------------------------------------------------------------------------------\n');
	if (__super__) {
		__proto__ = proto(__proto__, __super__.__proto__);
		__static__ = proto(__static__, __super__.__static__);
	}
	Class = proto(
		{
			name,
			// exposed proto:
			prototype: { ...__proto__ },
			// real proto
			__proto__,
			__static__,
			__super__,
			// used as a manifest (for `super` helper)
			__class__: null,
			__new__: function (...args) {
				let instance = { constructor: Class };
				proto(instance, __proto__);
				// print('--------------------------------------------------------------------------------\n');
				// printf(`[${name} instance]: %.2J\n`, instance);
				// print('--------------------------------------------------------------------------------\n');
				if (type(instance.__constructor__) === 'function') instance.__constructor__(...args);
				return instance;
			}
		},
		__static__
	);
	// set class object on exposed proto for compatibility:
	Class.prototype.constructor = Class;
	// manifest
	Class.__class__ = Class;
	return Class;
};
