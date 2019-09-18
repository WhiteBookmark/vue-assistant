import { workspace, Uri, window } from 'vscode';
import { outputFile, ensureFile, pathExists } from 'fs-extra';
import { Scaffold } from './Scaffold';
import { Template } from './Template';
import { Helper } from './Helper';

export interface IFile {
	Create(): Promise<void>;
}
export interface FileParameters {
	Name: string;
	Extension: string;
	NameAndPathURI: Uri;
	NameAndPathInString: string;
	PathURI: Uri;
	PathInString: string;
	Template: string;
}
export class File implements IFile {
	private FileParameter: FileParameters;
	public constructor(Parameters: FileParameters) {
		this.FileParameter = Parameters;
	}
	public async Create(): Promise<void> {
		try {
			const CreationEnabled = Helper.Configuration('enableNewFileCreation');
			if (CreationEnabled === false) {
				return;
			}
			const FileAlreadyExists = await this.Exists();
			const OverwriteEnabled = Helper.Configuration('enableFileOverwriting');

			if (FileAlreadyExists && OverwriteEnabled === false) {
				window.showErrorMessage('Overwriting is disabled');
				return;
			}
			await outputFile(this.FileParameter.NameAndPathInString, this.FileParameter.Template);
		} catch (Error) {
			console.error(Error.toString());
		}
	}

	private async Exists(): Promise<boolean> {
		try {
			return await pathExists(this.FileParameter.NameAndPathInString);
		} catch (Error) {
			console.error(Error.toString());
			return false;
		}
	}
}
