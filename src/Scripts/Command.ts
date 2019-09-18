import { Disposable, window, commands } from 'vscode';
import { URI } from 'vscode-uri';
import { Path } from './Path';
import { File, FileParameters } from './File';
import { Names } from './Names';
import { Scaffold } from './Scaffold';

export interface ICommand {
	CreateNewFile(): Promise<Disposable | null>;
}
export class Command implements ICommand {
	public async CreateNewFile(): Promise<Disposable | null> {
		try {
			const NewFileCommand = commands.registerCommand('vueAsst.createNewFile', async (CallbackParams) => {
				const PathInstance = new Path(CallbackParams);
				await PathInstance.Initialize();

				if (!PathInstance.Current || !PathInstance.CurrentInString) {
					return;
				}
				const InputName = await window.showInputBox({
					value: 'NewVueFileName',
					valueSelection: undefined,
					validateInput: (UserInput: string) => (UserInput ? null : 'Invalid file name'),
				});
				if (!InputName) {
					return;
				}
				const FileNames = new Names(InputName);
				FileNames.Possibilities.forEach(async (FileInfo) => {
					const ScaffoldingText = new Scaffold(FileInfo);
					if (!PathInstance.CurrentInString || !PathInstance.Current) {
						return;
					}
					const FileData: FileParameters = {
						Name: FileInfo.Name,
						Extension: FileInfo.Extension,
						NameAndPathURI: URI.file(`${PathInstance.CurrentInString}/${FileInfo.Name}`),
						NameAndPathInString: `${PathInstance.CurrentInString}/${FileInfo.Name}`,
						PathURI: PathInstance.Current,
						PathInString: PathInstance.CurrentInString,
						Template: ScaffoldingText.Text,
					};

					const FileInstance = new File(FileData);
					await FileInstance.Create();
				});
			});
			return NewFileCommand;
		} catch (Error) {
			console.error(Error.toString());
			return null;
		}
	}
}
