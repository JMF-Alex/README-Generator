class ReadmeGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupDynamicItems();
    }

    initializeElements() {
        this.form = document.getElementById('readmeForm');
        this.readmeOutput = document.getElementById('readmeOutput');
        this.readmePreview = document.getElementById('readmePreview');
        this.copyBtn = document.getElementById('copyReadme');
        this.rawTab = document.getElementById('rawTab');
        this.previewTab = document.getElementById('previewTab');
        this.rawOutput = document.getElementById('rawOutput');
        this.previewOutput = document.getElementById('previewOutput');
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.form.addEventListener('input', this.handleFormChange.bind(this));
        this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));

        document.getElementById('addFeature').addEventListener('click', this.addFeatureItem.bind(this));
        document.getElementById('addRoadmap').addEventListener('click', this.addRoadmapItem.bind(this));

        this.rawTab.addEventListener('click', () => this.switchTab('raw'));
        this.previewTab.addEventListener('click', () => this.switchTab('preview'));

        document.addEventListener('click', this.handleDynamicRemove.bind(this));
        document.addEventListener('click', this.handleTechTabs.bind(this));
        document.addEventListener('change', this.handleTechSubcategories.bind(this));
        document.addEventListener('change', this.handleJavaVersionChange.bind(this));
    }

    setupDynamicItems() {
        this.initializeTechTabs();
        this.generateReadme();
    }

    initializeTechTabs() {
        const firstTab = document.querySelector('.tech-tabs .tab-button[data-tab="languages"]');
        if (firstTab) {
            this.switchTechTab('languages');
        }
    }

    handleTechTabs(event) {
        if (event.target.classList.contains('tab-button') && event.target.dataset.tab) {
            event.preventDefault();
            this.switchTechTab(event.target.dataset.tab);
        }
    }

    switchTechTab(tabName) {
        document.querySelectorAll('.tech-tabs .tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.tech-tabs .tab-button[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tech-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    handleTechSubcategories(event) {
        if (!event.target.classList.contains('tech-checkbox')) return;

        const checkboxId = event.target.id;
        const isChecked = event.target.checked;

        switch (checkboxId) {
            case 'techJava':
                this.toggleSubcategory('javaSubcategories', isChecked);
                break;
            case 'techPython':
                this.toggleSubcategory('pythonSubcategories', isChecked);
                break;
            case 'techJs':
                this.toggleSubcategory('jsSubcategories', isChecked);
                break;
            case 'techTypeScript':
                this.toggleSubcategory('tsSubcategories', isChecked);
                break;
            case 'techPowerShell':
                this.toggleSubcategory('powershellSubcategories', isChecked);
                break;
            case 'techCss':
                this.toggleSubcategory('cssSubcategories', isChecked);
                break;
        }

        this.generateReadme();
    }

    toggleSubcategory(subcategoryId, show) {
        const subcategory = document.getElementById(subcategoryId);
        if (subcategory) {
            if (show) {
                subcategory.style.display = 'block';
            } else {
                subcategory.style.display = 'none';
                subcategory.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        this.generateReadme();
    }

    handleFormChange() {
        this.generateReadme();
    }

    handleDynamicRemove(event) {
        if (event.target.classList.contains('remove-feature')) {
            event.target.parentElement.remove();
            this.generateReadme();
        }
        if (event.target.classList.contains('remove-roadmap')) {
            event.target.parentElement.remove();
            this.generateReadme();
        }
    }

    addFeatureItem() {
        const container = document.getElementById('featuresContainer');
        const featureItem = this.createFeatureItem();
        container.appendChild(featureItem);
        featureItem.querySelector('.feature-input').focus();
    }

    addRoadmapItem() {
        const container = document.getElementById('roadmapContainer');
        const roadmapItem = this.createRoadmapItem();
        container.appendChild(roadmapItem);
        roadmapItem.querySelector('.roadmap-input').focus();
    }

    createFeatureItem() {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.innerHTML = `
            <input type="text" placeholder="Describe a feature..." class="feature-input input-field">
            <button type="button" class="btn btn-danger remove-feature">Remove</button>
        `;
        return featureItem;
    }

    createRoadmapItem() {
        const roadmapItem = document.createElement('div');
        roadmapItem.className = 'roadmap-item';
        roadmapItem.innerHTML = `
            <select class="roadmap-status select-field">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
            <input type="text" placeholder="Describe a roadmap task..." class="roadmap-input input-field">
            <button type="button" class="btn btn-danger remove-roadmap">Remove</button>
        `;
        return roadmapItem;
    }

    getFormData() {
        return {
            projectName: this.getElementValue('projectName'),
            githubUser: this.getElementValue('githubUser'),
            repoName: this.getElementValue('repoName'),
            projectDescription: this.getElementValue('projectDescription'),
            projectSize: this.getElementValue('projectSize'),
            licenseType: this.getElementValue('licenseType'),
            javaVersion: this.getElementValue('javaVersion'),

            badges: this.getBadgeSettings(),
            technologies: this.getTechnologySettings(),
            sections: this.getSectionSettings(),
            features: this.getFeaturesList(),
            roadmap: this.getRoadmapList()
        };
    }

    getElementValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    getBadgeSettings() {
        return {
            contributors: document.getElementById('badgeContributors').checked,
            forks: document.getElementById('badgeForks').checked,
            stars: document.getElementById('badgeStars').checked,
            issues: document.getElementById('badgeIssues').checked,
            license: document.getElementById('badgeLicense').checked
        };
    }

    getTechnologySettings() {
        const getCheckedValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.checked : false;
        };

        return {
            html: getCheckedValue('techHtml'),
            css: getCheckedValue('techCss'),
            js: getCheckedValue('techJs'),
            typescript: getCheckedValue('techTypeScript'),
            java: getCheckedValue('techJava'),
            python: getCheckedValue('techPython'),
            php: getCheckedValue('techPhp'),
            batch: getCheckedValue('techBatch'),
            powershell: getCheckedValue('techPowerShell'),
            shell: getCheckedValue('techShell'),
            react: getCheckedValue('techReact'),
            nextjs: getCheckedValue('techNextJs'),
            vue: getCheckedValue('techVue'),
            angular: getCheckedValue('techAngular'),
            astro: getCheckedValue('techAstro'),
            django: getCheckedValue('techDjango'),
            node: getCheckedValue('techNode'),
            git: getCheckedValue('techGit'),
            docker: getCheckedValue('techDocker'),
            webpack: getCheckedValue('techWebpack'),
            vite: getCheckedValue('techVite'),
            vercel: getCheckedValue('techVercel'),
            netlify: getCheckedValue('techNetlify'),
            heroku: getCheckedValue('techHeroku'),
            aws: getCheckedValue('techAws'),
            maven: getCheckedValue('techMaven'),
            gradle: getCheckedValue('techGradle'),
            javafx: getCheckedValue('techJavaFx'),
            tkinter: getCheckedValue('techTkinter'),
            jsx: getCheckedValue('techJsx'),
            tsx: getCheckedValue('techTsx'),
            windowsForms: getCheckedValue('techWindowsForms'),
            scss: getCheckedValue('techScss'),
            postCss: getCheckedValue('techPostCss')
        };
    }

    getSectionSettings() {
        return {
            about: document.getElementById('sectionAbout').checked,
            features: document.getElementById('sectionFeatures').checked,
            builtWith: document.getElementById('sectionBuiltWith').checked,
            gettingStarted: document.getElementById('sectionGettingStarted').checked,
            usage: document.getElementById('sectionUsage').checked,
            roadmap: document.getElementById('sectionRoadmap').checked,
            contributing: document.getElementById('sectionContributing').checked,
            license: document.getElementById('sectionLicense').checked,
            acknowledgments: document.getElementById('sectionAcknowledgments').checked
        };
    }

    getFeaturesList() {
        return Array.from(document.querySelectorAll('.feature-input'))
            .map(input => input.value.trim())
            .filter(value => value !== '');
    }

    getRoadmapList() {
        return Array.from(document.querySelectorAll('.roadmap-item'))
            .map(item => ({
                status: item.querySelector('.roadmap-status').value,
                text: item.querySelector('.roadmap-input').value.trim()
            }))
            .filter(item => item.text !== '');
    }

    generateReadme() {
        const data = this.getFormData();
        const readme = this.buildReadmeContent(data);
        this.displayReadme(readme);
    }

    buildReadmeContent(data) {
        let content = '';

        content += this.buildTopAnchor();
        content += this.buildBadgesSection(data);
        content += this.buildTechnologyBadges(data);
        content += this.buildTableOfContents(data);
        content += this.buildAboutSection(data);
        content += this.buildBuiltWithSection(data);
        content += this.buildGettingStartedSection(data);
        content += this.buildUsageSection(data);
        content += this.buildRoadmapSection(data);
        content += this.buildContributingSection(data);
        content += this.buildLicenseSection(data);
        content += this.buildAcknowledgmentsSection(data);

        return content;
    }

    buildTopAnchor() {
        return '<a id="readme-top"></a>\n\n';
    }

    buildBadgesSection(data) {
        if (!this.hasBadges(data.badges)) return '';

        const badgeConfigs = {
            contributors: `<a href="https://github.com/${data.githubUser}/${data.repoName}/graphs/contributors"><img src="https://img.shields.io/github/contributors/${data.githubUser}/${data.repoName}?style=for-the-badge" alt="Contributors"></a>`,
            forks: `<a href="https://github.com/${data.githubUser}/${data.repoName}/network/members"><img src="https://img.shields.io/github/forks/${data.githubUser}/${data.repoName}?style=for-the-badge" alt="Forks"></a>`,
            stars: `<a href="https://github.com/${data.githubUser}/${data.repoName}/stargazers"><img src="https://img.shields.io/github/stars/${data.githubUser}/${data.repoName}?style=for-the-badge" alt="Stargazers"></a>`,
            issues: `<a href="https://github.com/${data.githubUser}/${data.repoName}/issues"><img src="https://img.shields.io/github/issues/${data.githubUser}/${data.repoName}?style=for-the-badge" alt="Issues"></a>`,
            license: `<a href="https://github.com/${data.githubUser}/${data.repoName}/blob/main/LICENSE"><img src="https://img.shields.io/github/license/${data.githubUser}/${data.repoName}?style=for-the-badge" alt="License"></a>`
        };

        const selectedBadges = Object.keys(badgeConfigs)
            .filter(badge => data.badges[badge])
            .map(badge => badgeConfigs[badge]);

        if (selectedBadges.length === 0) return '';

        return `<p align="center">\n  ${selectedBadges.join(' ')}\n</p>\n\n`;
    }

    buildTechnologyBadges(data) {
        if (!this.hasTechnologies(data.technologies)) return '';

        const techBadges = {
            html: '<a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>',
            css: '<a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white" alt="CSS3"></a>',
            js: '<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>',
            typescript: '<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>',
            java: this.getJavaBadge(data.javaVersion),
            python: '<a href="https://python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>',
            php: '<a href="https://php.net/"><img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"></a>',
            batch: '<a href="#"><img src="https://img.shields.io/badge/Batch-4D4D4D?style=for-the-badge&logo=windows&logoColor=white" alt="Batch"></a>',
            powershell: '<a href="https://docs.microsoft.com/en-us/powershell/"><img src="https://img.shields.io/badge/PowerShell-5391FE?style=for-the-badge&logo=powershell&logoColor=white" alt="PowerShell"></a>',
            shell: '<a href="#"><img src="https://img.shields.io/badge/Shell-121011?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Shell"></a>',
            react: '<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>',
            nextjs: '<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>',
            vue: '<a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="Vue.js"></a>',
            angular: '<a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"></a>',
            astro: '<a href="https://astro.build/"><img src="https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro"></a>',
            django: '<a href="https://www.djangoproject.com/"><img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"></a>',
            node: '<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>',
            git: '<a href="https://git-scm.com/"><img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"></a>',
            docker: '<a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>',
            webpack: '<a href="https://webpack.js.org/"><img src="https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black" alt="Webpack"></a>',
            vite: '<a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>',
            vercel: '<a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"></a>',
            netlify: '<a href="https://www.netlify.com/"><img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify"></a>',
            heroku: '<a href="https://www.heroku.com/"><img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" alt="Heroku"></a>',
            aws: '<a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"></a>',
            maven: '<a href="https://maven.apache.org/"><img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven"></a>',
            gradle: '<a href="https://gradle.org/"><img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white" alt="Gradle"></a>',
            javafx: '<a href="https://openjfx.io/"><img src="https://img.shields.io/badge/JavaFX-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="JavaFX"></a>',
            tkinter: '<a href="https://docs.python.org/3/library/tkinter.html"><img src="https://img.shields.io/badge/Tkinter-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Tkinter"></a>',
            jsx: '<a href="#"><img src="https://img.shields.io/badge/JSX-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="JSX"></a>',
            tsx: '<a href="#"><img src="https://img.shields.io/badge/TSX-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TSX"></a>',
            windowsForms: '<a href="#"><img src="https://img.shields.io/badge/Windows_Forms-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Windows Forms"></a>',
            scss: '<a href="https://sass-lang.com/"><img src="https://img.shields.io/badge/SCSS%2FSASS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS"></a>',
            postCss: '<a href="https://postcss.org/"><img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS"></a>'
        };

        const selectedTechBadges = [];

        Object.keys(techBadges).forEach(tech => {
            if (data.technologies[tech]) {
                selectedTechBadges.push(techBadges[tech]);
            }
        });

        selectedTechBadges.push(`<a href="#"><img src="https://img.shields.io/badge/Size-${data.projectSize}-green?style=for-the-badge" alt="Size"></a>`);

        return `<p align="center">\n  ${selectedTechBadges.join(' ')}\n</p>\n\n`;
    }

    buildTableOfContents(data) {
        let content = '## Table of Contents\n\n';
        let counter = 1;

        const sections = [
            { key: 'about', title: 'About The Project', anchor: 'about-the-project' },
            { key: 'builtWith', title: 'Built With', anchor: 'built-with' },
            { key: 'gettingStarted', title: 'Getting Started', anchor: 'getting-started', subsections: ['Prerequisites', 'Installation'] },
            { key: 'usage', title: 'Usage', anchor: 'usage' },
            { key: 'roadmap', title: 'Roadmap', anchor: 'roadmap' },
            { key: 'contributing', title: 'Contributing', anchor: 'contributing' },
            { key: 'license', title: 'License', anchor: 'license' },
            { key: 'acknowledgments', title: 'Acknowledgments', anchor: 'acknowledgments' }
        ];

        sections.forEach(section => {
            if (data.sections[section.key]) {
                content += `${counter++}. [${section.title}](#${section.anchor})\n`;
                if (section.subsections) {
                    section.subsections.forEach(sub => {
                        content += `   * [${sub}](#${sub.toLowerCase()})\n`;
                    });
                }
            }
        });

        return content + '\n';
    }

    buildAboutSection(data) {
        if (!data.sections.about) return '';

        let content = '## About the Project\n\n';
        content += `**${data.projectName}** is ${data.projectDescription}\n\n`;

        if (data.sections.features && data.features.length > 0) {
            content += '### Features\n\n';
            data.features.forEach(feature => {
                content += `- ${feature}\n`;
            });
            content += '\n';
        }

        return content;
    }

    buildBuiltWithSection(data) {
        if (!data.sections.builtWith) return '';

        let content = '## Built With\n\n';
        content += 'This project was developed using:\n\n';

        const techNames = {
            html: '**HTML5** for structure and markup',
            css: '**CSS3** for design and responsive layout',
            js: '**JavaScript** for client-side functionality',
            typescript: '**TypeScript** for type-safe development',
            java: '**Java** for application development',
            python: '**Python** for backend logic',
            php: '**PHP** for server-side scripting',
            batch: '**Batch** for Windows automation',
            powershell: '**PowerShell** for system administration',
            shell: '**Shell** for Unix/Linux scripting',
            react: '**React** for user interface components',
            nextjs: '**Next.js** for full-stack React applications',
            vue: '**Vue.js** for progressive web applications',
            angular: '**Angular** for enterprise applications',
            astro: '**Astro** for static site generation',
            django: '**Django** for Python web development',
            node: '**Node.js** for backend development',
            git: '**Git** for version control',
            docker: '**Docker** for containerization',
            webpack: '**Webpack** for module bundling',
            vite: '**Vite** for fast development builds',
            vercel: '**Vercel** for deployment and hosting',
            netlify: '**Netlify** for static site hosting',
            heroku: '**Heroku** for cloud application hosting',
            aws: '**AWS** for cloud infrastructure',
            maven: '**Maven** for Java project management',
            gradle: '**Gradle** for build automation',
            javafx: '**JavaFX** for desktop GUI applications',
            tkinter: '**Tkinter** for Python GUI applications',
            jsx: '**JSX** for React component syntax',
            tsx: '**TSX** for TypeScript React components',
            windowsForms: '**Windows Forms** for desktop applications',
            scss: '**SCSS** for styling with variables and nesting',
            postcss: '**PostCSS** for transforming CSS with plugins'
        };

        Object.keys(techNames).forEach(tech => {
            if (data.technologies[tech]) {
                content += `- ${techNames[tech]}\n`;
            }
        });

        content += `\nRepository: [github.com/${data.githubUser}/${data.repoName}](https://github.com/${data.githubUser}/${data.repoName})\n\n`;
        return content;
    }

    buildGettingStartedSection(data) {
        if (!data.sections.gettingStarted) return '';

        let content = '## Getting Started\n\n';
        content += '### Prerequisites\n\n';
        content += 'No external dependencies required.\nOnly a **web browser** (Chrome, Edge, Firefox, etc.).\n\n';
        content += '### Installation\n\n';
        content += '1. Clone the repository:\n\n';
        content += '```bash\n';
        content += `git clone https://github.com/${data.githubUser}/${data.repoName}.git\n`;
        content += '```\n\n';
        content += '2. Enter the project directory:\n\n';
        content += '```bash\n';
        content += `cd ${data.repoName}\n`;
        content += '```\n\n';
        content += '3. Open `index.html` in your browser.\n\n';
        content += "That's it — the app runs entirely locally!\n\n";

        return content;
    }

    buildUsageSection(data) {
        if (!data.sections.usage) return '';

        let content = '## Usage\n\n';
        content += 'Once opened, you can:\n\n';
        content += '- Navigate through the application interface\n';
        content += '- Use the main features as intended\n';
        content += '- Data remains saved locally in your browser\n\n';

        return content;
    }

    buildRoadmapSection(data) {
        if (!data.sections.roadmap || data.roadmap.length === 0) return '';

        let content = '## Roadmap\n\n';
        data.roadmap.forEach(item => {
            const checkbox = item.status === 'completed' ? '[x]' : '[ ]';
            content += `- ${checkbox} ${item.text}\n`;
        });

        return content + '\n';
    }

    buildContributingSection(data) {
        if (!data.sections.contributing) return '';

        let content = '## Contributing\n\n';
        content += 'Contributions are welcome!\n\n';
        content += '1. Fork the repository\n';
        content += '2. Create a new branch (`git checkout -b feature/MyFeature`)\n';
        content += '3. Commit your changes (`git commit -m "Add new feature"`)\n';
        content += '4. Push to your branch (`git push origin feature/MyFeature`)\n';
        content += '5. Open a Pull Request\n\n';

        return content;
    }

    buildLicenseSection(data) {
        if (!data.sections.license) return '';

        let content = '## License\n\n';
        content += `Distributed under the ${data.licenseType} license.\n\n`;
        content += 'See the [`LICENSE`](LICENSE) file for more information.\n\n';

        return content;
    }

    buildAcknowledgmentsSection(data) {
        if (!data.sections.acknowledgments) return '';

        let content = '## Acknowledgments\n\n';
        content += '- Base template inspired by [Othneil Drew\'s Best-README-Template](https://github.com/othneildrew/Best-README-Template)\n';
        content += '- README Generated with [README-Generator](https://github.com/JMF-Alex/README-Generator)\n';
        content += `- Developed by [${data.githubUser}](https://github.com/${data.githubUser})\n`;

        return content;
    }

    hasBadges(badges) {
        return Object.values(badges).some(badge => badge);
    }

    hasTechnologies(technologies) {
        return Object.values(technologies).some(tech => tech);
    }

    getJavaBadge(version) {
        const javaVersion = version || '21';
        return `<a href="https://www.oracle.com/java/"><img src="https://img.shields.io/badge/Java-${javaVersion}-blue?style=for-the-badge&logo=java&logoColor=white" alt="Java"></a>`;
    }

    handleJavaVersionChange(event) {
        if (event.target.id === 'javaVersion') {
            this.generateReadme();
        }
    }

    displayReadme(content) {
        this.readmeOutput.textContent = content;
        this.renderMarkdownPreview(content);
    }

    renderMarkdownPreview(markdown) {
        const lines = markdown.split('\n');
        let html = '';
        let inList = false;
        let inOrderedList = false;
        let inCodeBlock = false;
        let codeBlockContent = '';
        let codeBlockLang = '';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    html += `<pre><code class="language-${codeBlockLang}">${codeBlockContent.trim()}</code></pre>\n`;
                    inCodeBlock = false;
                    codeBlockContent = '';
                    codeBlockLang = '';
                } else {
                    if (inList) {
                        html += '</ul>\n';
                        inList = false;
                    }
                    inCodeBlock = true;
                    codeBlockLang = line.substring(3).trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent += line + '\n';
                continue;
            }

            if (line.match(/^- \[x\] /)) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                const content = line.substring(6);
                html += `<li class="task-done">✅ ${this.processInlineMarkdown(content)}</li>\n`;
            } else if (line.match(/^- \[ \] /)) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                const content = line.substring(6);
                html += `<li class="task-pending">⏳ ${this.processInlineMarkdown(content)}</li>\n`;
            } else if (line.match(/^- /)) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                const content = line.substring(2);
                html += `<li>${this.processInlineMarkdown(content)}</li>\n`;
            } else if (line.match(/^   \* /)) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                const content = line.substring(5);
                html += `<li class="sub-item">${this.processInlineMarkdown(content)}</li>\n`;
            } else if (line.match(/^\* /)) {
                if (!inList) {
                    html += '<ul>\n';
                    inList = true;
                }
                const content = line.substring(2);
                html += `<li>${this.processInlineMarkdown(content)}</li>\n`;
            } else if (line.match(/^(\d+)\. /)) {
                if (inList) {
                    html += '</ul>\n';
                    inList = false;
                }
                if (!inOrderedList) {
                    html += '<ol>\n';
                    inOrderedList = true;
                }
                const match = line.match(/^(\d+)\. (.*)$/);
                html += `<li>${this.processInlineMarkdown(match[2])}</li>\n`;
            } else {
                if (inList) {
                    html += '</ul>\n';
                    inList = false;
                }
                if (inOrderedList) {
                    html += '</ol>\n';
                    inOrderedList = false;
                }

                if (line.match(/^### /)) {
                    html += `<h3>${this.processInlineMarkdown(line.substring(4))}</h3>\n`;
                } else if (line.match(/^## /)) {
                    html += `<h2>${this.processInlineMarkdown(line.substring(3))}</h2>\n`;
                } else if (line.match(/^# /)) {
                    html += `<h1>${this.processInlineMarkdown(line.substring(2))}</h1>\n`;
                } else if (line.trim() === '') {
                    html += '\n';
                } else if (line.includes('<p align="center">')) {
                    html += `${line}\n`;
                } else if (line.includes('</p>') && html.includes('<p align="center">')) {
                    html += `${line}\n`;
                } else if (line.includes('<a href=') && html.includes('<p align="center">') && !html.includes('</p>')) {
                    html += `${line}\n`;
                } else {
                    html += `<p>${this.processInlineMarkdown(line)}</p>\n`;
                }
            }
        }

        if (inList) {
            html += '</ul>\n';
        }
        if (inOrderedList) {
            html += '</ol>\n';
        }

        this.readmePreview.innerHTML = html;
    }

    processInlineMarkdown(text) {
        return text
            .replace(/`([^`\n]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '<a href="$2" target="_blank">$1</a>');
    }

    switchTab(tab) {
        if (tab === 'raw') {
            this.rawTab.classList.add('active');
            this.previewTab.classList.remove('active');
            this.rawOutput.classList.add('active');
            this.previewOutput.classList.remove('active');
        } else {
            this.previewTab.classList.add('active');
            this.rawTab.classList.remove('active');
            this.previewOutput.classList.add('active');
            this.rawOutput.classList.remove('active');
        }
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.readmeOutput.textContent);
            this.showCopyFeedback();
        } catch (err) {
            this.fallbackCopy();
        }
    }

    fallbackCopy() {
        const textArea = document.createElement('textarea');
        textArea.value = this.readmeOutput.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showCopyFeedback();
    }

    showCopyFeedback() {
        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = 'Copied!';
        this.copyBtn.style.background = '#38a169';

        setTimeout(() => {
            this.copyBtn.textContent = originalText;
            this.copyBtn.style.background = '';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReadmeGenerator();
});