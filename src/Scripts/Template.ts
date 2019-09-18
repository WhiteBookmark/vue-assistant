import { Disposable, window, commands, workspace } from 'vscode';
import { URI } from 'vscode-uri';
import { Path } from './Path';
import { File } from './File';
import { Helper } from './Helper';
import { readFile } from 'fs-extra';

export class Template {
	private readonly DefaultHTML: string = `
<template>

</template>`;
	private readonly DefaultJavascript: string = `
<script>
{0}
</script>`;
	private readonly DefaultCss: string = `
<style>

</style>`;

	private readonly DefaultJavascriptBoilerplate: string = `
export default {
	data() {

	},
	methods: {
	},
	mounted() {
	},
};`;

	public HTML(LineBreaks: number = 0): string {
		return Helper.AddLineBreaksInString(this.DefaultHTML, LineBreaks);
	}
	public Javascript(LineBreaks: number = 0, AddBoilerPlate: boolean = true): string {
		return this.FormatTemplate(this.DefaultJavascript, AddBoilerPlate, this.DefaultJavascriptBoilerplate, LineBreaks);
	}
	public JavascriptReference(FileNameAndExtension: string, LineBreaks: number = 0): string {
		return this.PrepareReferenceTemplate(this.DefaultJavascript, '<script>', `<script src="${FileNameAndExtension}">`, LineBreaks);
	}
	public CssReference(FileNameAndExtension: string, LineBreaks: number = 0): string {
		return this.PrepareReferenceTemplate(this.DefaultCss, '<style>', `<style src="${FileNameAndExtension}">`, LineBreaks);
	}
	public Css(LineBreaks: number = 0): string {
		return this.FormatTemplate(this.DefaultCss, false, '', LineBreaks);
	}
	public JavascriptBoilerplate(LineBreaks: number = 0): string {
		return this.FormatTemplate(this.DefaultJavascriptBoilerplate, false, '', LineBreaks);
	}

	private FormatTemplate(TemplateIn: string, AddBoilerPlate: boolean, BoilerPlate: string, LineBreaks: number = 0): string {
		try {
			let FormattedTemplate: string = TemplateIn;
			BoilerPlate = Helper.TrimExtraBlankLines(BoilerPlate);
			if (AddBoilerPlate) {
				FormattedTemplate = Helper.FormatString(FormattedTemplate, BoilerPlate);
			} else {
				FormattedTemplate = Helper.FormatString(FormattedTemplate, '');
			}
			return Helper.AddLineBreaksInString(FormattedTemplate, LineBreaks);
		} catch (Error) {
			console.error(Error.toString());
			return TemplateIn;
		}
	}
	private PrepareReferenceTemplate(TemplateIn: string, ToReplace: string, ReplacingString: string, LineBreaks: number = 0): string {
		try {
			let FormattedTemplate = TemplateIn;
			FormattedTemplate = FormattedTemplate.replace(ToReplace, ReplacingString);
			FormattedTemplate = Helper.TrimAllBlankLines(FormattedTemplate);
			return this.FormatTemplate(FormattedTemplate, false, '', LineBreaks);
		} catch (Error) {
			console.error(Error.toString());
			return TemplateIn;
		}
	}
}
