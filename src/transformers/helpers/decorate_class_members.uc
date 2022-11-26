/* eslint-disable no-undef */
export default (membersMap, decoratorsMap) => {
	const getPropDesc = (o, p) =>
		exists(o, p)
			? {
					value: o[p],
					writable: true,
					configurable: false,
					enumerable: true
			  }
			: null;
	const defineProp = (o, p, pd) => {
		const nh = (prop, expect) => {
			if (!exists(pd, prop) || pd[prop] == expect) return;
			die(`PropertyDescriptor.${p}: ${sprintf('%J', pd[prop])} not handled (property name: ${p})`);
		};
		nh('configurable', true);
		nh('writable', true);
		nh('enumerable', true);
		nh('get', null);
		nh('set', null);
		o[p] = pd.value;
		return o;
	};
	const scope = {
		Object: {
			getOwnPropertyDescriptor: getPropDesc,
			defineProperty: defineProp
		}
	};
	const decorate = (decorators, target, key) => {
		const desc = getPropDesc(target, key);
		let res;
		for (let d in decorators) {
			res = call(d, null, scope, target, key, res ?? desc) ?? res;
		}
		if (res) defineProp(target, key, res);
	};
	for (let key in keys(decoratorsMap)) {
		decorate(decoratorsMap[key], membersMap, key);
	}
	return membersMap;
};
