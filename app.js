const inquirer = require('inquirer');
const generatePage = require('./src/page-template.js');
const {writeFile, copyFile} = require('./utils/generate-site');

const promptUser = () => {
	return inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: 'What is your name?(Required)',
			validate: (nameInput) => {
				if (nameInput) {
					return true;
				} else {
					console.log('Please enter your name');
					return false;
				}
			},
		},
		{
			type: 'input',
			name: 'github',
			message: 'Enter your GitHub Username (Required)',
			validate: (usernameInput) => {
				if (usernameInput) {
					return true;
				} else {
					console.log('Please enter your username');
					return false;
				}
			},
		},
		{
			type: 'confirm',
			name: 'confirmAbout',
			message: 'Would you like to enter some information about yourself for an "About" section?',
			default: true,
		},
		{
			type: 'input',
			name: 'about',
			message: 'Provide some information about yourself',
			when: ({ confirmAbout }) => {
				if (confirmAbout) {
					return true;
				} else {
					return false;
				}
			},
		},
	]);
};

const promptProject = (portfolioData) => {
	if (!portfolioData.projects) {
		portfolioData.projects = [];
	}
	console.log(`
  =================
  Add a new project
  =================
  `);
	return inquirer
		.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your project? (Required)',
				validate: (projectNameInput) => {
					if (projectNameInput) {
						return true;
					} else {
						console.log('Project name is required');
						return false;
					}
				},
			},
			{
				type: 'input',
				name: 'description',
				message: 'Provide a description of your project (Required)',
				validate: (projectDescriptionInput) => {
					if (projectDescriptionInput) {
						return true;
					} else {
						console.log('Project description is required');
						return false;
					}
				},
			},
			{
				type: 'checkbox',
				name: 'stack',
				message: 'What did you use to build this project?',
				choices: ['HTML', 'CSS', 'JS', 'jQuery', 'Bootstrap', 'Tailwind', 'Node', 'React', 'Vue', 'Angular'],
			},
			{
				type: 'input',
				name: 'link',
				message: 'Enter the GitHub link to your project. (Required)',
				validate: (projectLink) => {
					if (projectLink) {
						return true;
					} else {
						console.log('Please provide a link to your project');
						return false;
					}
				},
			},
			{
				type: 'confirm',
				name: 'featured',
				message: 'Should this be a featured project?',
				default: false,
			},
			{
				type: 'confirm',
				name: 'confirmAddProject',
				message: 'Would you like to enter another project?',
				default: false,
			},
		])
		.then((projectData) => {
			portfolioData.projects.push(projectData);
			if (projectData.confirmAddProject) {
				return promptProject(portfolioData);
			} else {
				return portfolioData;
			}
		});
};

promptUser()
	.then(promptProject)
	.then((portfolioData) => {
		return generatePage(portfolioData);
	})
	.then((pageHTML) => {
		return writeFile(pageHTML);
	})
	.then((writeFileResponse) => {
		console.log(writeFileResponse);
		return copyFile();
	})
	.then((copyFileResponse) => {
		console.log(copyFileResponse);
	})
	.catch((err) => {
		console.log(err);
	});