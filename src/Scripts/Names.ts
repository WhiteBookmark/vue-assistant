import { Disposable, window, commands, workspace } from 'vscode';
import { URI } from 'vscode-uri';
import { Path } from './Path';
import { File } from './File';
import { Helper } from './Helper';

interface INames {
	Possibilities: NameAndExtension[];
}
export interface NameAndExtension {
	Name: string;
	Extension: string;
}
export class Names implements INames {
	public Possibilities: NameAndExtension[] = [];
	private PreferredName: string | null = null;
	public constructor(Name: string) {
		this.PreferredName = Name;
		this.CreateNames();
	}
	private CreateNames(): void {
		try {
			if (!this.PreferredName) {
				return;
			}
			const SplittingEnabled = Helper.Configuration('enableFileSplittingForNewFiles');
			let PossibleObject: NameAndExtension = {
				Name: `${this.PreferredName}.vue`,
				Extension: '.vue',
			};
			this.Possibilities = [PossibleObject];

			if (SplittingEnabled === false) {
				return;
			}

			const JavascriptSplittingEnabled = Helper.Configuration('enableJavascriptSplitting');
			if (JavascriptSplittingEnabled === false) {
				return;
			}
			const JavascriptExtension = Helper.Configuration('javascriptSplittingExtension');
			PossibleObject = {
				Name: `${this.PreferredName}${JavascriptExtension}`,
				Extension: `${JavascriptExtension}`,
			};
			this.Possibilities.push(PossibleObject);

			const CssSplittingEnabled = Helper.Configuration('enableCssSplitting');
			if (CssSplittingEnabled === false) {
				return;
			}
			const CssExtension = Helper.Configuration('cssSplittingExtension');
			PossibleObject = {
				Name: `${this.PreferredName}${CssExtension}`,
				Extension: `${CssExtension}`,
			};
			this.Possibilities.push(PossibleObject);
		} catch (Error) {
			console.error(Error.toString());
		}
	}
}
