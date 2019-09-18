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
	private readonly DefaultTypescript: string = `
<script lang="ts">
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
	private readonly DefaultTypescriptBoilerplate: string = `
import Vue from 'vue';

export default Vue.extend({
	data() {
	return {
	}
	},
	mounted(): void {
	}
});`;
	private readonly TypescriptBoilerplateClass: string = `
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
class {0} extends Vue {};`;
	private readonly TypescriptBoilerplateDecorator: string = `
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class {0} extends Vue {}`;

	public HTML(LineBreaks: number = 0): string {
		return Helper.AddLineBreaksInString(this.DefaultHTML, LineBreaks);
	}
	public Javascript(LineBreaks: number = 0, AddBoilerPlate: boolean = true): string {
		return this.FormatTemplate(this.DefaultJavascript, AddBoilerPlate, this.DefaultJavascriptBoilerplate, LineBreaks);
	}
	public Typescript(LineBreaks: number = 0, AddBoilerPlate: boolean = true, Boilerplate: string = ''): string {
		return this.FormatTemplate(this.DefaultTypescript, AddBoilerPlate, Boilerplate, LineBreaks);
	}
	public TypescriptBoilerplate(FileName: string, LineBreaks: number = 0, BoilerplateType: string = 'Default'): string {
		const Boilerplate: string = this.PickTypescriptBoilerplate(BoilerplateType);
		return this.FormatTemplate(Boilerplate, true, FileName, LineBreaks);
	}
	public TypescriptReference(FileNameAndExtension: string, LineBreaks: number = 0): string {
		return this.PrepareReferenceTemplate(this.DefaultTypescript, '<script lang="ts">', `<script lang="ts" src="${FileNameAndExtension}">`, LineBreaks);
	}
	public JavascriptReference(FileNameAndExtension: string, LineBreaks: number = 0): string {
		return this.PrepareReferenceTemplate(this.DefaultJavascript, '<script>', `<script src="${FileNameAndExtension}">`, LineBreaks);
	}
	public CssReference(FileNameAndExtension: string, LineBreaks: number = 0): string {
		const Extension = Helper.Configuration('cssSplittingExtension');
		switch (Extension) {
			default:
			case '.css':
				return this.PrepareReferenceTemplate(this.DefaultCss, '<style>', `<style src="${FileNameAndExtension}">`, LineBreaks);
				break;
			case '.sass':
				return this.PrepareReferenceTemplate(this.DefaultCss, '<style>', `<style lang="sass" src="${FileNameAndExtension}">`, LineBreaks);
				break;
			case '.scss':
				return this.PrepareReferenceTemplate(this.DefaultCss, '<style>', `<style lang="scss" src="${FileNameAndExtension}">`, LineBreaks);
				break;
			case '.less':
				return this.PrepareReferenceTemplate(this.DefaultCss, '<style>', `<style lang="less" src="${FileNameAndExtension}">`, LineBreaks);
				break;
		}
	}
	public Css(LineBreaks: number = 0): string {
		const Extension = Helper.Configuration('cssSplittingExtension');
		let ChoosenTemplate: string = this.DefaultCss;
		switch (Extension) {
			default:
			case '.css':
				ChoosenTemplate = this.DefaultCss;
				break;
			case '.sass':
				ChoosenTemplate = ChoosenTemplate.replace('<style>', '<style lang="sass">');
				break;
			case '.scss':
				ChoosenTemplate = ChoosenTemplate.replace('<style>', '<style lang="scss">');
				break;
			case '.less':
				ChoosenTemplate = ChoosenTemplate.replace('<style>', '<style lang="less">');
				break;
		}
		return this.FormatTemplate(ChoosenTemplate, false, '', LineBreaks);
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
	private PickTypescriptBoilerplate(Type: string): string {
		try {
			if (Type === 'Class') {
				return this.TypescriptBoilerplateClass;
			} else if (Type === 'Decorator') {
				return this.TypescriptBoilerplateDecorator;
			} else {
				return this.DefaultTypescriptBoilerplate;
			}
		} catch (Error) {
			console.error(Error.toString());
			return this.DefaultTypescriptBoilerplate;
		}
	}
}
