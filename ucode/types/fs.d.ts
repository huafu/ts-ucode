/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.d.ts" />

declare module 'fs' {
  export const enum Seek {
    set = 1,
    cur = 2,
    end = 3,
  }
  export const enum StatType {
    file = 'file',
    directory = 'directory',
    char = 'char',
    block = 'block',
    fifo = 'fifo',
    link = 'link',
    socket = 'socket',
    unknown = 'unknown',
  }
  export interface IFile {
    close(): bool;
    error: ErrorFunction;
    fileno(): int;
    flush(): bool;
    read(what: 'all' | 'line' | int): str;
    seek(offset: int | null, whence?: Seek): bool;
    tell(): int;
    write(data: any): int;
  }
  export interface IProcess {
    close(): int;
    error: ErrorFunction;
    fileno(): int;
    flush(): bool;
    read(what: 'all' | 'line' | int): str;
    write(data: any): int;
  }
  export interface IDir {
    close(): bool;
    error: ErrorFunction;
    read(): str;
    seek(offset: int): bool;
    tell(): int;
  }
  export interface IStat {
    atime: int;
    blksize: int;
    blocks: int;
    ctime: int;
    dev: {
      major: int;
      minor: int;
    };
    gid: int;
    inode: int;
    mode: int;
    mtime: int;
    nlink: int;
    perm: {
      group_exec: bool;
      group_read: bool;
      group_write: bool;
      other_exec: bool;
      other_read: bool;
      other_write: bool;
      setgid: bool;
      setuid: bool;
      sticky: bool;
      user_exec: bool;
      user_read: bool;
      user_write: bool;
    };
    size: int;
    type: StatType;
    uid: int;
  }

  export const error: ErrorFunction;
  export const stdin: IFile;
  export const stdout: IFile;
  export const stderr: IFile;

  export function access(path: str, test?: str): bool;
  export function basename(path: str): str;
  export function chdir(path: str): bool;
  export function chmod(path: str, mode: int): bool;
  export function chown(path: str, user: str | int | null, group?: str | int | null): bool;
  export function dirname(path: str): str | null;
  export function fdopen(fdno: int, mode?: 'r' | 'w' | 'a' | 'r+' | 'w+' | 'a+'): IFile | null;
  export function getcwd(): str;
  export function glob(...pattern: str[]): array<str>;
  export function lsdir(path: str, pattern?: str | regexp | null): array<str>;
  export function lstat(path: str): IStat | null;
  export function mkdir(path: str, mode?: int): bool;
  export function mkstemp(template?: str): IFile | null;
  export function open(path: str, mode?: 'r' | 'w' | 'a' | 'r+' | 'w+' | 'a+'): IFile | null;
  export function opendir(path: str): IDir | null;
  export function popen(cmd: str, mode?: 'r' | 'w'): IProcess | null;
  export function readfile(path: str, size?: int): str | null;
  export function readlink(path: str): str | null;
  export function realpath(path: str): str | null;
  export function rename(old_path: str, new_path: str): bool;
  export function rmdir(path: str): bool;
  export function stat(path: str): IStat | null;
  export function symlink(dest: str, path: str): bool;
  export function unlink(path: str): bool;
  export function writefile(path: str, data: any, size?: int): int;
}
