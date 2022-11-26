export default (object, Class) => {
	let klass = object?.constructor;
	while (klass) {
		if (klass === Class) return true;
		klass = klass.__super__;
	}
	return false;
};
