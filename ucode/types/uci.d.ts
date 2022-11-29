/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./uci.types.d.ts" />

declare module 'uci' {
  export interface ICursor {
    add(pkg: PackageName, type: str): SectionName | null;
    changes(): { [K in PackageName]: Operation[] };
    changes(pkg: PackageName): Operation[];
    commit(): bool;
    configs(): PackageName[];
    delete(pkg: PackageName, section: SectionName, option: OptionName): bool;
    delete(pkg: PackageName, section: SectionName): bool;
    error: ErrorFunction;
    foreach(pkg: PackageName, type: str | null, fn: (section: ISection) => bool): bool;
    get_all(pkg: PackageName, section: SectionName): ISection | null;
    get_all(pkg: PackageName): IPackage | null;
    get_first(pkg: PackageName, type: str, option: OptionName): any_data | null;
    get_first(pkg: PackageName, type: str): OptionName | null;
    get(pkg: PackageName, section: SectionName, option: OptionName): any_data | null;
    load(pkg: PackageName): bool;
    rename(pkg: PackageName, section: SectionName, new_type: str): bool;
    rename(pkg: PackageName, section: SectionName, option: OptionName, new_name: OptionName): bool;
    reorder(pkg: PackageName, section: SectionName, idx: int): bool;
    revert(pkg: PackageName): bool;
    save(): bool;
    set(pkg: PackageName, section: SectionName, option: OptionName, val: any_data): bool;
    set(pkg: PackageName, section: SectionName, type: str): bool;
    unload(pkg: PackageName): bool;
  }

  // core types
  export function cursor(): ICursor;
  export const error: ErrorFunction;
}
