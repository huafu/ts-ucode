/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.d.ts" />

declare module 'uci' {
	export type bool_data = '0' | '1';
	export type option_data = str;
	export type list_data = option_data[];
	export type any_data = option_data | list_data;
	export interface ISectionMeta<type extends str = str, anonymous extends bool = bool> {
		'.name': str;
		'.type': type;
		'.anonymous': anonymous;
		'.index'?: int;
	}
	export type SectionMetaKey = keyof ISectionMeta;
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface IPackageMeta {}
	export type PackageMetaKey = keyof IPackageMeta;
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface IConfigMeta {}
	export type ConfigMetaKey = keyof IConfigMeta;

	export type MetaKey = ConfigMetaKey | PackageMetaKey | ConfigMetaKey;

	export interface ISectionData {
		[option_name: str]: any_data | undefined;
	}
	export type OptionName = keyof ISectionData;
	export type ISection<type extends str = str, anonymous extends bool = bool> = ISectionMeta<
		type,
		anonymous
	> &
		ISectionData;
	export type SectionKey = SectionMetaKey | OptionName;
	export type IAnonymousSection<type extends str = str> = ISection<type, true>;
	export type INamedSection<type extends str = str> = ISection<type, false>;

	export interface IPackageData {
		[section_name: str]: ISection | undefined;
	}
	export type SectionName = keyof IPackageData;
	export type IPackage = IPackageMeta & IPackageData;
	export type PackageKey = PackageMetaKey | SectionName;

	export interface IConfigData {
		[package_name: str]: IPackage | undefined;
	}
	export type PackageName = keyof IConfigData;
	export type IConfig = IConfigMeta & IConfigData;
	export type ConfigKey = ConfigMetaKey | PackageName;

	export type OperationKind =
		| 'add'
		| 'remove'
		| 'set'
		| 'list-add'
		| 'list-del'
		| 'rename'
		| 'order';

	export type OperationSetSection = [op: 'set', section_name: str, section_type: str];
	export type OperationSetOption = [
		op: 'set',
		section_name: str,
		option_name: str,
		option_value: str
	];
	export type OperationAddSection = [op: 'add', section_name: str, section_type: str];
	export type OperationListAdd = [op: 'list-add', section_name: str, list_name: str, item: str];
	export type OperationListDel = [op: 'list-del', section_name: str, list_name: str, item: str];
	export type OperationRemoveOption = [op: 'remove', section_name: str, option_name: str];
	export type OperationRemoveSection = [op: 'remove', section_name: str];
	export type OperationRenameSection = [op: 'rename', section_name: str, new_name: str];
	export type OperationRenameOption = [
		op: 'rename',
		section_name: str,
		option_name: str,
		new_name: str
	];
	export type OperationReorder = [op: 'order', section_name: str, new_index: int];
	export type Operation =
		| OperationSetSection
		| OperationSetOption
		| OperationAddSection
		| OperationListAdd
		| OperationListDel
		| OperationRemoveOption
		| OperationRemoveSection
		| OperationRenameSection
		| OperationRenameOption
		| OperationReorder;

	export type OperationsMap = { [Config in PackageName]: Operation[] };
}
