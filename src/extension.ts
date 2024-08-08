
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscodethemedevkit" is now active!');


	const createThemeStructureDisposable = vscode.commands.registerCommand('vscodethemedevkit.createThemeStructure', async () => {
		const folderPath = await vscode.window.showInputBox({ prompt: 'Enter the path for the new theme' });

		if (!folderPath) {
			vscode.window.showErrorMessage('No folder path provided');
			return;
		}

		createThemeStructure(folderPath);
		vscode.window.showInformationMessage("Theme structure created at ${folderPath}");
	});

	context.subscriptions.push(createThemeStructureDisposable);
}

// Function to create the theme structure
function createThemeStructure(folderPath: string) {
	const themeFolder = path.join(folderPath, 'my-vscode-theme');
	fs.mkdirSync(themeFolder, { recursive: true });

	const files = [
		{ name: '.vscode/launch.json', content: getLaunchJsonContent() },
		{ name: 'package.json', content: getPackageJsonContent() },
		{ name: 'README.md', content: getReadmeContent() },
		{ name: 'CHANGELOG.md', content: getChangelogContent() },
		{ name: '.gitignore', content: getGitignoreContent() },
		{ name: 'themes/my-theme-color-theme.json', content: getThemeJsonContent() }
	];

	files.forEach(file => {
		const filePath = path.join(themeFolder, file.name);
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, file.content);
	});
}

const getLaunchJsonContent = () => {
	return JSON.stringify({
		version: "0.2.0",
		configurations: [
			{
				name: "Extension",
				type: "extensionHost",
				request: "launch",
				args: [
					"--extensionDevelopmentPath=${workspaceFolder}"
				]
			}
		]
	});
};

function getPackageJsonContent() {
	return JSON.stringify({
		name: "my-vscode-theme",
		displayName: "My VSCode Theme",
		description: "A custom VSCode theme",
		version: "0.0.1",
		publisher: "your-name",
		engines: {
			vscode: "^1.60.0"
		},
		categories: [
			"Themes"
		],
		contributes: {
			themes: [
				{
					label: "My Theme",
					uiTheme: "vs-dark",
					path: "./themes/my-theme-color-theme.json"
				}
			]
		}
	}, null, 2);
}

function getReadmeContent() {
	return "# My VSCode Theme\n\nA custom VSCode theme.\n";
}

function getChangelogContent() {
	return "# Changelog\n\n## 0.0.1\n- Initial release\n";
}

function getGitignoreContent() {
	return "node_modules\n.vscode\nout\n";
}

function getThemeJsonContent() {
	return JSON.stringify({
		"$schema": "vscode://schemas/color-theme",
		"name": "My Theme",
		"type": "dark",
		"colors": {},
		"tokenColors": []
	}, null, 2);
}

// This method is called when your extension is deactivated
export function deactivate() {}