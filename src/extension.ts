import * as vscode from 'vscode';
import File from './Scripts/File';
import { URI } from 'vscode-uri';

export async function activate(context: vscode.ExtensionContext) {
	const documentSelector: vscode.DocumentSelector = {
		language: 'vue',
		scheme: 'file',
	};

	const EchoHellowWorld = vscode.commands.registerCommand('extension.helloWorld', async () => {
		vscode.window.showInformationMessage('Hello VS Code');
		File.CreateNew();

		const Folders = vscode.workspace.workspaceFolders;
		if (!Folders) {
			return;
		}
		Folders.forEach(async (element) => {
			const ReadDir = await vscode.workspace.fs.readDirectory(URI.file(element.uri.fsPath));
			ReadDir!.forEach((Dir) => {
				console.log(Dir[0]);
			});
		});
	});

	context.subscriptions.push(EchoHellowWorld);
}

export function deactivate() {}
