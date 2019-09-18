import { ExtensionContext, workspace } from 'vscode';
import { Command } from './Scripts/Command';

export async function activate(context: ExtensionContext) {
	try {
		const CommandsList = new Command();
		const NewFileCommand = await CommandsList.CreateNewFile();

		if (NewFileCommand) {
			context.subscriptions.push(NewFileCommand);
		}
	} catch (Error) {
		console.error(Error.toString());
	}
}

export function deactivate() {}
