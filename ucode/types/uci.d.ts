/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./uci.types.d.ts" />

declare module 'uci' {
  export interface ICursor {
    load(pkg: PackageName): bool;
    unload(pkg: PackageName): bool;
    get(pkg: PackageName, section: SectionName, option: OptionName): any_data | null;
    get_all(pkg: PackageName, section: SectionName): ISection | null;
    get_all(pkg: PackageName): IPackage | null;
    get_first(pkg: PackageName, type: str, option: OptionName): any_data | null;
    get_first(pkg: PackageName, type: str): OptionName | null;
    add(pkg: PackageName, type: str): SectionName | null;
    set(pkg: PackageName, section: SectionName, option: OptionName, val: any_data): bool;
    set(pkg: PackageName, section: SectionName, type: str): bool;
    rename(pkg: PackageName, section: SectionName, option: OptionName, new_name: OptionName): bool;
    rename(pkg: PackageName, section: SectionName, new_type: str): bool;
    save(): bool;
    delete(pkg: PackageName, section: SectionName, option: OptionName): bool;
    delete(pkg: PackageName, section: SectionName): bool;
    commit(): bool;
    revert(pkg: PackageName): bool;
    reorder(pkg: PackageName, section: SectionName, idx: int): bool;
    changes(): { [K in PackageName]: Operation[] };
    changes(pkg: PackageName): Operation[];
    configs(): PackageName[];
    foreach(pkg: PackageName, type: str | null, fn: (section: ISection) => bool): bool;

    error: ErrorFunction;
  }

  // core types
  export function cursor(): ICursor;
  export const error: ErrorFunction;
}
