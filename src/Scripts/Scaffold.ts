import { Disposable, window, commands, workspace } from 'vscode';
import { URI } from 'vscode-uri';
import { Path } from './Path';
import { File } from './File';
import { Helper } from './Helper';
import { Template } from './Template';
import { NameAndExtension } from './Names';

interface IScaffold {
	Text: string;
}
interface IEnabledSettings {
	Global?: boolean;
	HTML?: boolean;
	Javascript?: boolean;
	Css?: boolean;
}
interface ISplitting {
	Enabled?: boolean;
	Javascript?: boolean;
	Css?: boolean;
}
interface IBoilerplate {
	Global?: boolean;
	Javascript?: boolean;
}
export class Scaffold implements IScaffold {
	public Text: string = '';
	private FileInfo: NameAndExtension;
	private Scaffolding: IEnabledSettings = {
		Global: Helper.Configuration('enableScaffolding'),
		HTML: Helper.Configuration('enableHtmlScaffolding'),
		Javascript: Helper.Configuration('enableJavascriptScaffolding'),
		Css: Helper.Configuration('enableCssScaffolding'),
	};
	private Splitting: ISplitting = {
		Enabled: Helper.Configuration('enableFileSplittingForNewFiles'),
		Javascript: Helper.Configuration('enableJavascriptSplitting'),
		Css: Helper.Configuration('enableCssSplitting'),
	};
	private Boilerplate: IBoilerplate = {
		Global: Helper.Configuration('enableBoilerplate'),
		Javascript: Helper.Configuration('addJavascriptBoilerplate'),
	};
	public constructor(InfoIn: NameAndExtension) {
		this.FileInfo = InfoIn;
		this.Initialize();
	}
	private Initialize(): void {
		try {
			if (!this.FileInfo.Extension || !this.Scaffolding.Global) {
				return;
			}

			const AvailableTemplates: Template = new Template();
			switch (this.FileInfo.Extension) {
				case '.js':
					if (this.Scaffolding.Global && this.Scaffolding.Javascript) {
						this.Text = AvailableTemplates.JavascriptBoilerplate();
					}
					break;

				case '.ts':
					if (this.Scaffolding.Global && this.Scaffolding.Javascript) {
						this.Text = AvailableTemplates.TypescriptBoilerplate(
							this.FileInfo.Name.replace('.ts', ''),
							0,
							Helper.Configuration('typescriptBoilerplateStyle'),
						);
					}
					break;

				case '.css':
				case '.sass':
				case '.scss':
				case '.less':
					break;

				case '.vue':
				default:
					// Validate and add html template
					if (this.Scaffolding.HTML) {
						this.Text = AvailableTemplates.HTML();
					}
					// Validate and add js template
					this.ConfigureScriptForVue(AvailableTemplates);
					// Validate and add css template
					this.ConfigureStyleForVue(AvailableTemplates);
					break;
			}
			this.Text = Helper.TrimExtraBlankLines(this.Text);
		} catch (Error) {
			console.error(Error.toString());
		}
	}

	private ConfigureScriptForVue(AvailableTemplates: Template): void {
		try {
			switch (Helper.Configuration('javascriptSplittingExtension')) {
				default:
				case '.js':
					if (this.Scaffolding.Javascript && (!this.Splitting.Enabled || !this.Splitting.Javascript)) {
						this.Text += AvailableTemplates.Javascript(1, this.Boilerplate.Global && this.Boilerplate.Javascript);
					} else if (this.Splitting.Enabled && this.Splitting.Javascript) {
						this.Text += AvailableTemplates.JavascriptReference(this.FileInfo.Name.replace('.vue', ''), 1);
					}
					break;
				case '.ts':
					const Style = Helper.Configuration('typescriptBoilerplateStyle');
					const FileName: string = this.FileInfo.Name.replace('.vue', '');
					const FileNameWithExtension: string = this.FileInfo.Name.replace('.vue', '.ts');
					if (this.Scaffolding.Javascript && (!this.Splitting.Enabled || !this.Splitting.Javascript)) {
						if (this.Boilerplate.Global && this.Boilerplate.Javascript) {
							this.Text += AvailableTemplates.Typescript(1);
						} else {
							const Boilerplate: string = AvailableTemplates.TypescriptBoilerplate(FileName, 0, Style);
							this.Text += AvailableTemplates.TypescriptBoilerplate(FileName, 1, Boilerplate);
						}
					} else if (this.Splitting.Enabled && this.Splitting.Javascript) {
						this.Text += AvailableTemplates.TypescriptReference(FileNameWithExtension, 1);
					}
					break;
			}
		} catch (Error) {
			console.error(Error.toString());
		}
	}
	private ConfigureStyleForVue(AvailableTemplates: Template): void {
		try {
			if (this.Scaffolding.Css && (!this.Splitting.Enabled || !this.Splitting.Css)) {
				// For no external css
				this.Text += AvailableTemplates.Css(1);
			} else if (this.Splitting.Enabled && this.Splitting.Css) {
				// For external css
				const Extension = Helper.Configuration('cssSplittingExtension');
				this.Text += AvailableTemplates.CssReference(this.FileInfo.Name.replace('.vue', Extension), 1);
			}
		} catch (Error) {
			console.error(Error.toString());
		}
	}
}
