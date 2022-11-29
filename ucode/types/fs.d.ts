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
    read(what: 'all' | 'line' | int): str;
    write(data: any): int;
    flush(): bool;
    fileno(): int;
    close(): bool;
    tell(): int;
    seek(offset: int | null, whence?: Seek): bool;
    error: ErrorFunction;
  }
  export interface IProcess {
    read(what: 'all' | 'line' | int): str;
    write(data: any): int;
    flush(): bool;
    fileno(): int;
    close(): int;
    error: ErrorFunction;
  }
  export interface IDir {
    read(): str;
    seek(offset: int): bool;
    tell(): int;
    close(): bool;
    error: ErrorFunction;
  }
  export interface IStat {
    dev: {
      major: int;
      minor: int;
    };
    perm: {
      setuid: bool;
      setgid: bool;
      sticky: bool;

      user_read: bool;
      user_write: bool;
      user_exec: bool;

      group_read: bool;
      group_write: bool;
      group_exec: bool;

      other_read: bool;
      other_write: bool;
      other_exec: bool;
    };
    inode: int;
    mode: int;
    nlink: int;
    uid: int;
    gid: int;
    size: int;
    blksize: int;
    blocks: int;
    atime: int;
    mtime: int;
    ctime: int;
    type: StatType;
  }

  export const stdin: IFile;
  export const stdout: IFile;
  export const stderr: IFile;

  export function popen(cmd: str, mode?: 'r' | 'w'): IProcess | null;
  export function open(path: str, mode?: 'r' | 'w' | 'a' | 'r+' | 'w+' | 'a+'): IFile | null;
  export function fdopen(fdno: int, mode?: 'r' | 'w' | 'a' | 'r+' | 'w+' | 'a+'): IFile | null;
  export function opendir(path: str): IDir | null;
  export function readlink(path: str): str | null;
  export function stat(path: str): IStat | null;
  export function lstat(path: str): IStat | null;
  export function mkdir(path: str, mode?: int): bool;
  export function rmdir(path: str): bool;
  export function symlink(dest: str, path: str): bool;
  export function unlink(path: str): bool;
  export function getcwd(): str;
  export function chdir(path: str): bool;
  export function chmod(path: str, mode: int): bool;
  export function chown(path: str, user: str | int | null, group?: str | int | null): bool;
  export function rename(old_path: str, new_path: str): bool;
  export function glob(...pattern: str[]): array<str>;
  export function dirname(path: str): str | null;
  export function basename(path: str): str;
  export function lsdir(path: str, pattern?: str | regexp | null): array<str>;
  export function mkstemp(template?: str): IFile | null;
  export function access(path: str, test?: str): bool;
  export function readfile(path: str, size?: int): str | null;
  export function writefile(path: str, data: any, size?: int): int;

  export const error: ErrorFunction;
}
