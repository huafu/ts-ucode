export enum Environment {
	development = 'development',
	production = 'production'
}

let printer: Console;
let environment: Environment = Environment.production;

export const setEnvironment = (env: Environment | string = Environment.production) => {
	if (!Environment[<Environment>env]) {
		env = Environment.production;
	}
	environment = <Environment>env;
};

export const getEnvironment = () => environment;

const consoleMethods = [
	'assert',
	'clear',
	'count',
	'debug',
	'dir',
	'dirxml',
	'error',
	'exception',
	'group',
	'groupCollapsed',
	'groupEnd',
	'info',
	'log',
	'markTimeline',
	'profile',
	'profileEnd',
	'table',
	'time',
	'timeEnd',
	'timeline',
	'timelineEnd',
	'timeStamp',
	'trace',
	'warn'
];
export const getPrinter = () => {
	if (printer) return printer;

	printer = <Console>{};
	for (let method of consoleMethods) {
		(<any>printer)[method] = (...args: any[]) => {
			if (environment === Environment.production) return;
			return (<any>console)[method](...args);
		};
	}
	return printer;
};
