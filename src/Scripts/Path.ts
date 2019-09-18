import { Uri, window, workspace } from 'vscode';
import { URI } from 'vscode-uri';
export interface IPath {
	Current: Uri | null;
	CurrentInString: string | null;
	Initialize(): Promise<void>;
}
export class Path implements IPath {
	public Current: Uri | null = null;
	public CurrentInString: string | null = null;

	private readonly ExplorerInfo: any;

	public constructor(CallbackParams: any) {
		this.ExplorerInfo = CallbackParams;
	}
	public async Initialize(): Promise<void> {
		try {
			let PathInfo = this.ExplorerInfo;
			if (!PathInfo && window.activeTextEditor) {
				PathInfo = window.activeTextEditor.document.uri;
			}
			if (!PathInfo) {
				await window.showErrorMessage('Cannot copy relative path, as there appears no file is opened (or it is very large');
				return;
			}

			// Parse the folder URI as string
			PathInfo = PathInfo.path;

			// Code reserved for future need, for now extension will only create file when a folder is selected
			// Remove file name and its extension from the path so we get the path to parent folder or current folder only
			// const RegexForFileExtension = /[^\/](\w+\.\w+$)/i;
			// PathInfo = PathInfo.replace(RegexForFileExtension, '');

			// Remove trailing slashes if exist
			PathInfo = PathInfo.replace(/\/+$/, '');
			this.CurrentInString = PathInfo ? PathInfo : null;
			this.Current = URI.file(PathInfo);
		} catch (Error) {
			console.error(Error.toString());
		}
	}
}
