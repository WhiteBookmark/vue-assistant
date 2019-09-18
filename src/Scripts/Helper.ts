import { Disposable, window, commands, workspace } from 'vscode';
import { URI } from 'vscode-uri';
import { Path } from './Path';
import { File } from './File';

export class Helper {
	public static Configuration(Name: string): any {
		try {
			return workspace.getConfiguration('vueAsst').get(Name);
		} catch (Error) {
			console.error(Error.toString());
			return null;
		}
	}
	public static AddLineBreaksInString(StringIn: string, Total: number = 0, Pre: boolean = true): string {
		try {
			let TemplateCreator: string = StringIn;
			let LineBreaks: string = '';
			for (let LineNumber = Total; LineNumber > 0; LineNumber--) {
				LineBreaks += '\n';
			}
			if (Total === 0) {
				return StringIn;
			} else if (Pre) {
				TemplateCreator = LineBreaks + TemplateCreator;
			} else {
				TemplateCreator += LineBreaks;
			}
			return TemplateCreator;
		} catch (Error) {
			console.error(Error.toString());
			return StringIn;
		}
	}
	public static TrimExtraBlankLines(StringIn: string): string {
		try {
			return StringIn.replace(/^\s+|\s+$/g, '');
		} catch (Error) {
			console.error(Error.toString());
			return StringIn;
		}
	}
	public static TrimAllBlankLines(StringIn: string): string {
		try {
			return StringIn.replace(/(^[ \t]*\n)/gm, '');
		} catch (Error) {
			console.error(Error.toString());
			return StringIn;
		}
	}
	public static FormatString(StringIn: string, ...Values: string[]) {
		try {
			for (let PlaceHolder = 0; PlaceHolder < Values.length; PlaceHolder++) {
				StringIn = StringIn.replace(`{${PlaceHolder}}`, Values[PlaceHolder]);
			}
			return StringIn;
		} catch (Error) {
			console.error(Error.toString());
			return StringIn;
		}
	}
}
