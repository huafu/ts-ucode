/* eslint-disable no-undef */
export default (objOrClass, method, ...args) => {
	const isStatic = objOrClass?.__class__ && objOrClass.__class__ === objOrClass;
	const Class = isStatic ? objOrClass : objOrClass.constructor;
	const Super = Class.__super__;
	if (!method) return Super;
	const owner = Super[isStatic ? '__static__' : '__proto__'];
	if (method === '__constructor__' && !exists(owner, method)) return;
	return call(owner[method], objOrClass, null, ...args);
};
